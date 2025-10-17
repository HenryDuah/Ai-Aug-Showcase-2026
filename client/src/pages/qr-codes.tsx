import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, QrCode as QrIcon } from "lucide-react";
import QRCode from "qrcode";
import sectionsData from "@/data/products.json";

export default function QRCodes() {
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const canvasRefs = useRef<Record<number, HTMLCanvasElement>>({});

  useEffect(() => {
    const baseUrl = window.location.origin;
    
    // Generate QR codes for sections
    sectionsData.sections.forEach((section) => {
      const sectionUrl = `${baseUrl}/section/${section.id}`;
      
      QRCode.toDataURL(sectionUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then((url) => {
        setQrCodes((prev) => ({ ...prev, [`section-${section.id}`]: url }));
      });
    });

    // Generate QR code for feedback page
    const feedbackUrl = `${baseUrl}/feedback`;
    QRCode.toDataURL(feedbackUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    }).then((url) => {
      setQrCodes((prev) => ({ ...prev, 'feedback': url }));
    });
  }, []);

  const downloadQR = (id: string, name: string, qrDataUrl: string) => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qr-${id}-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.click();
  };

  const downloadAllQRs = () => {
    let index = 0;
    
    // Download section QR codes
    sectionsData.sections.forEach((section) => {
      const key = `section-${section.id}`;
      if (qrCodes[key]) {
        setTimeout(() => {
          downloadQR(key, section.name, qrCodes[key]);
        }, index * 150);
        index++;
      }
    });

    // Download feedback QR code
    if (qrCodes['feedback']) {
      setTimeout(() => {
        downloadQR('feedback', 'Share Your Thoughts', qrCodes['feedback']);
      }, index * 150);
    }
  };

  const allQRsReady = 
    sectionsData.sections.every((section) => qrCodes[`section-${section.id}`]) &&
    qrCodes['feedback'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <QrIcon className="h-8 w-8" />
                QR Codes
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Download QR codes for direct section access and feedback
              </p>
            </div>
          </div>
          <Button 
            onClick={downloadAllQRs}
            disabled={!allQRsReady}
            className="gap-2"
            data-testid="button-download-all"
          >
            <Download className="h-4 w-4" />
            {allQRsReady ? "Download All" : "Generating..."}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectionsData.sections.map((section) => {
            const qrKey = `section-${section.id}`;
            return (
              <Card key={section.id} data-testid={`card-qr-${section.id}`}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Section {section.id}: {section.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                    {qrCodes[qrKey] ? (
                      <img 
                        src={qrCodes[qrKey]} 
                        alt={`QR Code for ${section.name}`}
                        className="w-full max-w-[200px]"
                        data-testid={`img-qr-${section.id}`}
                      />
                    ) : (
                      <div className="w-[200px] h-[200px] bg-gray-100 animate-pulse rounded" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center break-all" data-testid={`text-url-${section.id}`}>
                    {window.location.origin}/section/{section.id}
                  </div>
                  <Button
                    onClick={() => downloadQR(qrKey, section.name, qrCodes[qrKey])}
                    disabled={!qrCodes[qrKey]}
                    className="w-full gap-2"
                    data-testid={`button-download-${section.id}`}
                  >
                    <Download className="h-4 w-4" />
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {/* Feedback QR Code */}
          <Card data-testid="card-qr-feedback">
            <CardHeader>
              <CardTitle className="text-lg">
                Share Your Thoughts (Feedback)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                {qrCodes['feedback'] ? (
                  <img 
                    src={qrCodes['feedback']} 
                    alt="QR Code for Feedback Page"
                    className="w-full max-w-[200px]"
                    data-testid="img-qr-feedback"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-gray-100 animate-pulse rounded" />
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center break-all" data-testid="text-url-feedback">
                {window.location.origin}/feedback
              </div>
              <Button
                onClick={() => downloadQR('feedback', 'Share Your Thoughts', qrCodes['feedback'])}
                disabled={!qrCodes['feedback']}
                className="w-full gap-2"
                data-testid="button-download-feedback"
              >
                <Download className="h-4 w-4" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Use QR Codes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-600 dark:text-gray-400">
            <p>
              <strong>1. Print QR codes:</strong> Download and print each QR code to display at the corresponding section in your physical lab.
            </p>
            <p>
              <strong>2. Visitor scanning:</strong> Visitors can scan the QR code with their smartphone camera to jump directly to that section's products.
            </p>
            <p>
              <strong>3. Direct access:</strong> No need to navigate through the overview - each QR code takes visitors straight to the right section.
            </p>
            <p className="text-sm text-muted-foreground">
              Tip: QR codes work best when printed at least 2x2 inches in size for easy scanning.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
