"""
generate_report.py
==================
Generates a baseline security PDF report (security-report.pdf) for the
Deskflow CI pipeline using environment variables set by GitHub Actions steps.

Dependencies: reportlab==4.2.5
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# ---------------------------------------------------------------------------
# Colour palette
# ---------------------------------------------------------------------------
BRAND_DARK   = colors.HexColor("#1A202C")
BRAND_BLUE   = colors.HexColor("#3B82F6")
PASS_GREEN   = colors.HexColor("#16A34A")
FAIL_RED     = colors.HexColor("#DC2626")
WARN_YELLOW  = colors.HexColor("#D97706")
SKIP_GREY    = colors.HexColor("#6B7280")
ROW_EVEN     = colors.HexColor("#F9FAFB")
ROW_ODD      = colors.white
HEADER_BG    = colors.HexColor("#1E3A5F")
SECTION_BG   = colors.HexColor("#EFF6FF")
BORDER_COLOR = colors.HexColor("#CBD5E1")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _env(key: str, default: str = "") -> str:
    return os.environ.get(key, default).strip()


def _int_env(key: str, default: int = 0) -> int:
    try:
        return int(_env(key, str(default)))
    except ValueError:
        return default


def status_color(status: str) -> colors.Color:
    s = status.upper()
    if s in ("PASS", "TRUE"):
        return PASS_GREEN
    if s in ("FAIL", "FALSE"):
        return FAIL_RED
    if s == "NOT RUN":
        return SKIP_GREY
    return WARN_YELLOW


def badge(text: str, bg: colors.Color) -> Table:
    """Renders a coloured badge cell."""
    t = Table([[text]], colWidths=[3 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",  (0, 0), (-1, -1), bg),
        ("TEXTCOLOR",   (0, 0), (-1, -1), colors.white),
        ("FONTNAME",    (0, 0), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, -1), 9),
        ("ALIGN",       (0, 0), (-1, -1), "CENTER"),
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",  (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
    ]))
    return t


# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------

def build_styles() -> dict:
    base = getSampleStyleSheet()

    def ps(name, **kwargs) -> ParagraphStyle:
        return ParagraphStyle(name, parent=base["Normal"], **kwargs)

    return {
        "title": ps(
            "ReportTitle",
            fontSize=22,
            fontName="Helvetica-Bold",
            textColor=colors.white,
            alignment=TA_CENTER,
            spaceAfter=4,
        ),
        "subtitle": ps(
            "ReportSubtitle",
            fontSize=10,
            fontName="Helvetica",
            textColor=colors.HexColor("#CBD5E1"),
            alignment=TA_CENTER,
            spaceAfter=2,
        ),
        "section": ps(
            "SectionHeading",
            fontSize=13,
            fontName="Helvetica-Bold",
            textColor=BRAND_DARK,
            spaceBefore=16,
            spaceAfter=6,
        ),
        "body": ps(
            "BodyText",
            fontSize=9,
            fontName="Helvetica",
            textColor=BRAND_DARK,
            spaceAfter=4,
            leading=14,
        ),
        "label": ps(
            "Label",
            fontSize=9,
            fontName="Helvetica-Bold",
            textColor=BRAND_DARK,
        ),
        "mono": ps(
            "Mono",
            fontSize=8,
            fontName="Courier",
            textColor=BRAND_DARK,
            backColor=colors.HexColor("#F1F5F9"),
            leftIndent=6,
            rightIndent=6,
            spaceAfter=3,
            leading=12,
        ),
        "small": ps(
            "Small",
            fontSize=8,
            fontName="Helvetica",
            textColor=SKIP_GREY,
        ),
    }


# ---------------------------------------------------------------------------
# Section builders
# ---------------------------------------------------------------------------

def section_header(title: str, styles: dict):
    return [
        Spacer(1, 0.3 * cm),
        HRFlowable(width="100%", thickness=1.5, color=BRAND_BLUE, spaceAfter=6),
        Paragraph(title, styles["section"]),
    ]


def kv_table(rows: list[tuple], styles: dict) -> Table:
    """Two-column key-value table."""
    data = [[Paragraph(k, styles["label"]), Paragraph(str(v), styles["body"])]
            for k, v in rows]
    t = Table(data, colWidths=[5.5 * cm, 11 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), ROW_ODD),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [ROW_EVEN, ROW_ODD]),
        ("GRID",          (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ("VALIGN",        (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
    ]))
    return t


def findings_table(headers: list, rows: list, styles: dict) -> Table:
    """Generic multi-column table with styled header row."""
    col_count = len(headers)
    col_w = 16.5 * cm / col_count
    header_row = [Paragraph(h, ParagraphStyle(
        "TH", fontName="Helvetica-Bold", fontSize=8,
        textColor=colors.white, alignment=TA_CENTER
    )) for h in headers]
    data = [header_row]
    for row in rows:
        data.append([Paragraph(str(c), styles["body"]) for c in row])

    t = Table(data, colWidths=[col_w] * col_count, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",     (0, 0), (-1, 0), HEADER_BG),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [ROW_EVEN, ROW_ODD]),
        ("GRID",           (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ("VALIGN",         (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",     (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING",  (0, 0), (-1, -1), 5),
        ("LEFTPADDING",    (0, 0), (-1, -1), 6),
        ("RIGHTPADDING",   (0, 0), (-1, -1), 6),
    ]))
    return t


# ---------------------------------------------------------------------------
# Cover / header block
# ---------------------------------------------------------------------------

def build_cover(styles: dict) -> list:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    repo   = _env("REPO_NAME",   "deskflow")
    branch = _env("BRANCH_NAME", "main")
    run_id = _env("RUN_ID",      "N/A")

    cover_table = Table(
        [[
            Paragraph("Deskflow", styles["title"]),
            Paragraph("Baseline Security & Quality Report", styles["subtitle"]),
            Paragraph(f"Repository: {repo}  |  Branch: {branch}  |  Run: #{run_id}  |  {now}",
                      styles["subtitle"]),
        ]],
        colWidths=[16.5 * cm],
    )
    cover_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), HEADER_BG),
        ("TOPPADDING",    (0, 0), (-1, -1), 18),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 18),
        ("LEFTPADDING",   (0, 0), (-1, -1), 14),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 14),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ]))
    return [cover_table, Spacer(1, 0.5 * cm)]


# ---------------------------------------------------------------------------
# Section 1 — General Information
# ---------------------------------------------------------------------------

def build_general_info(styles: dict) -> list:
    now    = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    repo   = _env("REPO_NAME",   "N/A")
    branch = _env("BRANCH_NAME", "N/A")
    sha    = _env("COMMIT_SHA",  "N/A")
    run_id = _env("RUN_ID",      "N/A")
    run_no = _env("RUN_NUMBER",  "N/A")

    rows = [
        ("Repository",       repo),
        ("Branch",           branch),
        ("Commit SHA",       sha[:12] + "..." if len(sha) > 12 else sha),
        ("Workflow Run ID",  run_id),
        ("Workflow Run #",   run_no),
        ("Scan Date / Time", now),
        ("Node.js Version",  _env("NODE_VERSION", "20")),
    ]
    return [
        *section_header("1. General Information", styles),
        kv_table(rows, styles),
    ]


# ---------------------------------------------------------------------------
# Section 2 — Code Coverage
# ---------------------------------------------------------------------------

def build_coverage(styles: dict) -> list:
    has_tests   = _env("HAS_TESTS",       "false").lower()
    actual      = _env("ACTUAL_COVERAGE", "")
    cov_pass    = _env("COVERAGE_PASS",   "")
    threshold   = _env("COVERAGE_THRESHOLD", "80")

    if has_tests == "true" and actual and actual != "unknown":
        status_text  = "PASS" if cov_pass == "true" else "FAIL"
        actual_text  = f"{actual}%"
        reason_text  = "—"
    else:
        status_text  = "NOT RUN"
        actual_text  = "N/A"
        reason_text  = "No automated test cases found"

    bg = status_color(status_text)
    rows = [
        ("Test Cases Detected", "Yes" if has_tests == "true" else "No"),
        ("Test Framework",      "Vitest"),
        ("Coverage Threshold",  f"{threshold}%"),
        ("Actual Coverage",     actual_text),
        ("Reason (if skipped)", reason_text),
        ("Status",              status_text),
    ]
    elems = [
        *section_header("2. Code Coverage", styles),
        kv_table(rows, styles),
    ]

    # Include per-file coverage if available
    cov_file = Path("coverage/coverage-summary.json")
    if cov_file.exists():
        try:
            data = json.loads(cov_file.read_text())
            file_rows = []
            for path, metrics in data.items():
                if path == "total":
                    continue
                short = path.replace(os.getcwd(), "").lstrip("/\\")
                lines_pct = metrics.get("lines", {}).get("pct", "N/A")
                stmts_pct = metrics.get("statements", {}).get("pct", "N/A")
                funcs_pct = metrics.get("functions", {}).get("pct", "N/A")
                file_rows.append([short, f"{lines_pct}%", f"{stmts_pct}%", f"{funcs_pct}%"])

            if file_rows:
                elems.append(Spacer(1, 0.3 * cm))
                elems.append(Paragraph("Per-file Coverage Summary", styles["label"]))
                elems.append(Spacer(1, 0.15 * cm))
                elems.append(findings_table(
                    ["File", "Lines %", "Statements %", "Functions %"],
                    file_rows[:50],  # cap at 50 rows to keep PDF manageable
                    styles,
                ))
        except Exception:
            pass

    return elems


# ---------------------------------------------------------------------------
# Section 3 — Dependency Audit
# ---------------------------------------------------------------------------

def build_audit(styles: dict) -> list:
    audit_pass    = _env("AUDIT_PASS",    "true")
    high_critical = _int_env("HIGH_CRITICAL", 0)

    # Parse npm-audit.json for detailed counts
    critical = high = moderate = low = total = 0
    affected_packages: list[dict] = []

    audit_file = Path("npm-audit.json")
    if audit_file.exists():
        try:
            audit_data = json.loads(audit_file.read_text())
            v = audit_data.get("metadata", {}).get("vulnerabilities", {})
            critical  = v.get("critical",  0)
            high      = v.get("high",      0)
            moderate  = v.get("moderate",  0)
            low       = v.get("low",       0)
            total     = v.get("total",     critical + high + moderate + low)

            # Collect advisory details (npm audit v7+ format)
            vulns = audit_data.get("vulnerabilities", {})
            for pkg_name, pkg_info in list(vulns.items())[:30]:
                sev = pkg_info.get("severity", "unknown")
                via = pkg_info.get("via", [])
                title = ""
                if via and isinstance(via[0], dict):
                    title = via[0].get("title", "")
                affected_packages.append({
                    "package":  pkg_name,
                    "severity": sev,
                    "title":    title or "See npm advisory",
                })
        except Exception:
            pass

    status_text = "PASS" if audit_pass == "true" else "FAIL"

    rows = [
        ("Tool",                    "npm audit"),
        ("Critical Vulnerabilities", str(critical)),
        ("High Vulnerabilities",     str(high)),
        ("Moderate Vulnerabilities", str(moderate)),
        ("Low Vulnerabilities",      str(low)),
        ("Total Vulnerabilities",    str(total)),
        ("Status",                   status_text),
    ]
    elems = [
        *section_header("3. Dependency Audit", styles),
        kv_table(rows, styles),
    ]

    if affected_packages:
        elems.append(Spacer(1, 0.3 * cm))
        elems.append(Paragraph("Affected Packages (top 30)", styles["label"]))
        elems.append(Spacer(1, 0.15 * cm))
        pkg_rows = [
            [p["package"], p["severity"].upper(), p["title"]]
            for p in affected_packages
        ]
        elems.append(findings_table(["Package", "Severity", "Advisory Title"], pkg_rows, styles))

    return elems


# ---------------------------------------------------------------------------
# Section 4 — SAST Scan (Semgrep)
# ---------------------------------------------------------------------------

def build_sast(styles: dict) -> list:
    semgrep_pass   = _env("SEMGREP_PASS",   "true")
    semgrep_total  = _int_env("SEMGREP_TOTAL",  0)
    semgrep_errors = _int_env("SEMGREP_ERRORS", 0)

    # Parse semgrep-results.json for detailed findings
    findings: list[dict] = []
    sev_counts = {"ERROR": 0, "WARNING": 0, "INFO": 0}

    sast_file = Path("semgrep-results.json")
    if sast_file.exists():
        try:
            sast_data  = json.loads(sast_file.read_text())
            raw_results = sast_data.get("results", [])
            for f in raw_results:
                sev = (f.get("extra", {}).get("severity") or "INFO").upper()
                sev_counts[sev] = sev_counts.get(sev, 0) + 1
                findings.append({
                    "file":    f.get("path", "N/A"),
                    "line":    f.get("start", {}).get("line", "?"),
                    "rule":    f.get("check_id", "N/A"),
                    "sev":     sev,
                    "message": (f.get("extra", {}).get("message") or "")[:120],
                })
        except Exception:
            pass

    status_text = "PASS" if semgrep_pass == "true" else "FAIL"

    rows = [
        ("Tool",                     "Semgrep"),
        ("Ruleset",                  "p/javascript, p/react"),
        ("Total Findings",           str(semgrep_total)),
        ("Error / Critical",         str(sev_counts.get("ERROR", semgrep_errors))),
        ("Warning / High",           str(sev_counts.get("WARNING", 0))),
        ("Info / Low",               str(sev_counts.get("INFO", 0))),
        ("GitHub Code Scanning",     "SARIF uploaded (semgrep-results.sarif)"),
        ("Status",                   status_text),
    ]
    elems = [
        *section_header("4. SAST Scan — Semgrep", styles),
        kv_table(rows, styles),
    ]

    if findings:
        elems.append(Spacer(1, 0.3 * cm))
        elems.append(Paragraph(
            f"Semgrep Findings ({min(len(findings), 50)} shown)",
            styles["label"],
        ))
        elems.append(Spacer(1, 0.15 * cm))
        finding_rows = [
            [
                f["file"].split("/")[-1],
                str(f["line"]),
                f["sev"],
                f["rule"].split(".")[-1][:40],
                f["message"][:80],
            ]
            for f in findings[:50]
        ]
        elems.append(findings_table(
            ["File", "Line", "Severity", "Rule", "Message"],
            finding_rows,
            styles,
        ))
        elems.append(Spacer(1, 0.2 * cm))
        elems.append(Paragraph(
            "Full findings are available in GitHub Code Scanning via the uploaded SARIF file.",
            styles["small"],
        ))

    return elems


# ---------------------------------------------------------------------------
# Section 5 — Overall CI Status
# ---------------------------------------------------------------------------

def build_overall_status(styles: dict) -> list:
    has_tests   = _env("HAS_TESTS",     "false").lower()
    cov_pass    = _env("COVERAGE_PASS", "")
    audit_pass  = _env("AUDIT_PASS",    "true")
    semgrep_pass = _env("SEMGREP_PASS", "true")

    gates = []

    # Coverage gate
    if has_tests == "true":
        cov_status = "PASS" if cov_pass == "true" else ("FAIL" if cov_pass == "false" else "UNKNOWN")
    else:
        cov_status = "SKIPPED"
    gates.append(("Code Coverage", cov_status))

    # Audit gate
    dep_status = "PASS" if audit_pass == "true" else "FAIL"
    gates.append(("Dependency Audit (npm audit)", dep_status))

    # Semgrep gate
    sast_status = "PASS" if semgrep_pass == "true" else "FAIL"
    gates.append(("SAST Scan (Semgrep)", sast_status))

    # Overall
    overall_fail = any(s == "FAIL" for _, s in gates)
    overall = "FAIL" if overall_fail else "PASS"
    overall_color = FAIL_RED if overall_fail else PASS_GREEN

    gate_rows = [[g[0], g[1]] for g in gates]

    overall_table = Table(
        [[Paragraph(f"Overall CI Status: {overall}", ParagraphStyle(
            "Overall",
            fontName="Helvetica-Bold",
            fontSize=14,
            textColor=colors.white,
            alignment=TA_CENTER,
        ))]],
        colWidths=[16.5 * cm],
    )
    overall_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), overall_color),
        ("TOPPADDING",    (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ]))

    return [
        *section_header("5. Overall CI Security Status", styles),
        findings_table(["Security Gate", "Result"], gate_rows, styles),
        Spacer(1, 0.4 * cm),
        overall_table,
        Spacer(1, 0.3 * cm),
    ]


# ---------------------------------------------------------------------------
# Footer callback
# ---------------------------------------------------------------------------

def _footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(SKIP_GREY)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    canvas.drawString(1.5 * cm, 0.8 * cm,
                      f"Deskflow — Baseline Security Report  |  {now}  |  Page {doc.page}")
    canvas.restoreState()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    output_path = "security-report.pdf"
    print(f"Generating PDF report → {output_path}")

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=2 * cm,
        title="Deskflow Baseline Security Report",
        author="GitHub Actions CI",
        subject="Security & Code Quality Baseline",
    )

    styles = build_styles()
    story  = []

    story += build_cover(styles)
    story += build_general_info(styles)
    story += build_coverage(styles)
    story += build_audit(styles)
    story += build_sast(styles)
    story += build_overall_status(styles)

    doc.build(story, onFirstPage=_footer, onLaterPages=_footer)
    print(f"PDF report saved: {output_path}")


if __name__ == "__main__":
    main()
