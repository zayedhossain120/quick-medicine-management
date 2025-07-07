"use client";
import { Download, Loader2 } from "lucide-react";
import React, { Fragment, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DownloadPdfButton = ({
  hasIcon,
  className,
  pdfContent,
  label,
  disabled = false,
  filename = "transactions.pdf",
}: {
  hasIcon?: boolean;
  className?: string;
  pdfContent?: React.ReactNode;
  label?: string;
  disabled?: boolean;
  filename?: string;
}) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!pdfRef.current) {
      console.error("PDF ref not found");
      return;
    }

    setIsGenerating(true);

    try {
      // Create a temporary container that's completely off-screen
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "800px";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.padding = "20px";
      tempContainer.style.zIndex = "-1";

      // Clone the content to avoid affecting the original
      const clonedContent = pdfRef.current.cloneNode(true) as HTMLElement;
      tempContainer.appendChild(clonedContent);
      document.body.appendChild(tempContainer);

      // Convert HTML to canvas
      const canvas = await html2canvas(clonedContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: true,
        width: 800,
        height: clonedContent.scrollHeight,
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Clean up the temporary container
      const tempContainer = document.querySelector('div[style*="-9999px"]');
      if (tempContainer) {
        document.body.removeChild(tempContainer);
      }
      setIsGenerating(false);
    }
  };

  return (
    <Fragment>
      <button
        disabled={disabled || isGenerating}
        onClick={handleDownload}
        className={`text-white rounded-md p-2.5 transition-all duration-300 ease-in-out flex items-center justify-center gap-1 ${
          disabled || isGenerating ? "opacity-50" : "hover:scale-105"
        } ${className}`}
      >
        {hasIcon &&
          (isGenerating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          ))}
        {label && (
          <span className="text-sm">
            {isGenerating ? "Generating..." : label}
          </span>
        )}
      </button>
      <div
        ref={pdfRef}
        className="absolute left-[-9999px] top-[-9999px] bg-white"
        style={{ width: "800px", minHeight: "297mm" }}
      >
        {pdfContent}
      </div>
    </Fragment>
  );
};

export default DownloadPdfButton;
