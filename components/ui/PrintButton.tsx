"use client";
import { Printer } from "lucide-react";
import React, { Fragment, useRef } from "react";

const PrintButton = ({
  hasIcon,
  className,
  printContent,
  label,
  disabled = false,
}: {
  hasIcon?: boolean;
  className?: string;
  printContent?: React.ReactNode;
  label?: string;
  disabled?: boolean;
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print</title>");

      // Copy all styles from current document
      const styles = Array.from(document.styleSheets)
        .map(
          (styleSheet) =>
            `<style>${Array.from(styleSheet.cssRules || [])
              .map((rule) => rule.cssText)
              .join("")}</style>`
        )
        .join("");
      printWindow.document.write(styles);

      printWindow.document.write("</head><body>");
      printWindow.document.write(printContents);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };
  return (
    <Fragment>
      <button
        disabled={disabled}
        onClick={handlePrint}
        className={`text-white rounded-md p-2.5  transition-all duration-300 ease-in-out flex items-center justify-center gap-1 ${
          disabled ? "opacity-50" : "hover:scale-105"
        }  ${className}`}
      >
        {hasIcon && <Printer size={16} />}
        {label && <span className="text-sm">{label}</span>}
      </button>
      <div ref={printRef} className="hidden">
        {printContent}
      </div>
    </Fragment>
  );
};

export default PrintButton;
