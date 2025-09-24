import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';

interface PageSizeOption {
  value: string;
  label: string;
}

interface OrientationOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-text-to-pdf',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-to-pdf.component.html',
  styleUrls: ['./text-to-pdf.component.scss'],
})
export class TextToPdfComponent {
  isGenerating = false;

  pageSizes: PageSizeOption[] = [
    { value: 'a3', label: 'A3' },
    { value: 'a4', label: 'A4' },
    { value: 'a5', label: 'A5' },
    { value: 'letter', label: 'Letter' },
    { value: 'legal', label: 'Legal' },
  ];

  orientations: OrientationOption[] = [
    { value: 'portrait', label: 'Portrait' },
    { value: 'landscape', label: 'Landscape' },
  ];

  pdfForm = new FormGroup({
    textContent: new FormControl('', [Validators.required, Validators.maxLength(10000)]),
    fileName: new FormControl('document'),
    pageSize: new FormControl('a4'),
    orientation: new FormControl('portrait'),
  });

  showNotification(message: string, type: 'success' | 'error' = 'success') {
    // Simple alert for now, can be replaced with a custom notification component
    alert(message);
  }

  convertToPdf() {
    if (this.pdfForm.invalid) {
      return;
    }

    this.isGenerating = true;

    // Simulate processing delay
    setTimeout(() => {
      try {
        const { textContent, fileName, pageSize, orientation } = this.pdfForm.value;

        if (!textContent) {
          this.showNotification('Please enter some text to convert', 'error');
          return;
        }

        // Create a new PDF document
        const doc = new jsPDF({
          orientation: orientation as any,
          unit: 'mm',
          format: pageSize as any,
        });

        // Split the text into lines that fit the page width
        const pageWidth = orientation === 'portrait' ? 190 : 277; // mm
        const textLines = doc.splitTextToSize(textContent, pageWidth - 20);

        // Add the text to the PDF
        doc.text(textLines, 10, 10);

        // Save the PDF
        doc.save(`${fileName || 'document'}.pdf`);

        this.showNotification('PDF generated successfully!');
      } catch (error) {
        console.error('Error generating PDF:', error);
        this.showNotification('Error generating PDF. Please try again.', 'error');
      } finally {
        this.isGenerating = false;
      }
    }, 500);
  }

  clearForm() {
    this.pdfForm.reset({
      textContent: '',
      fileName: 'document',
      pageSize: 'a4',
      orientation: 'portrait',
    });
  }
}
