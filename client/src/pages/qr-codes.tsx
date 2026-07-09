import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, QrCode as QrIcon } from "lucide-react";
import QRCode from "qrcode";
import sectionsData from "@/data/products.json";

export default function QRCodes() {
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    const baseUrl = window.location.origin;
    
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
    
    sectionsData.sections.forEach((section) => {
      const key = `section-${section.id}`;
      if (qrCodes[key]) {
        setTimeout(() => {
          downloadQR(key, section.name, qrCodes[key]);
        }, index * 150);
        index++;
      }
    });

    if (qrCodes['feedback']) {
      setTimeout(() => {
        downloadQR('feedback', 'Share your thoughts', qrCodes['feedback']);
      }, index * 150);
    }
  };

  const allQRsReady = 
    sectionsData.sections.every((section) => qrCodes[`section-${section.id}`]) &&
    qrCodes['feedback'];

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <div className="bg-muted px-6 py-6 border-b border-border mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hover:bg-neutral-200" data-testid="button-back">
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Button>
            </Link>
            <div>
              <h1 className="text-h1 text-foreground flex items-center gap-3">
                <QrIcon className="h-6 w-6" />
                QR codes
              </h1>
            </div>
          </div>
          <Button 
            onClick={downloadAllQRs}
            disabled={!allQRsReady}
            className="h-10 text-body shadow-1"
            data-testid="button-download-all"
          >
            <Download className="h-4 w-4 mr-2" />
            {allQRsReady ? "Download all" : "Generating..."}
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sectionsData.sections.map((section) => {
            const qrKey = `section-${section.id}`;
            return (
              <Card key={section.id} className="shadow-1 rounded-lg border-border" data-testid={`card-qr-${section.id}`}>
                <CardContent className="p-6">
                  <h3 className="text-h3 text-foreground mb-4">
                    Section {section.id}: {section.name}
                  </h3>
                  <div className="bg-white p-4 rounded-md border border-border flex items-center justify-center mb-4">
                    {qrCodes[qrKey] ? (
                      <img 
                        src={qrCodes[qrKey]} 
                        alt={`QR Code for ${section.name}`}
                        className="w-full max-w-[200px]"
                        data-testid={`img-qr-${section.id}`}
                      />
                    ) : (
                      <div className="w-[200px] h-[200px] bg-muted animate-pulse rounded" />
                    )}
                  </div>
                  <div className="text-code text-muted-foreground text-center break-all mb-4" data-testid={`text-url-${section.id}`}>
                    {window.location.origin}/section/{section.id}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => downloadQR(qrKey, section.name, qrCodes[qrKey])}
                    disabled={!qrCodes[qrKey]}
                    className="w-full h-10 text-body"
                    data-testid={`button-download-${section.id}`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {/* Feedback QR Code */}
          <Card className="shadow-1 rounded-lg border-border" data-testid="card-qr-feedback">
            <CardContent className="p-6">
              <h3 className="text-h3 text-foreground mb-4">
                Feedback
              </h3>
              <div className="bg-white p-4 rounded-md border border-border flex items-center justify-center mb-4">
                {qrCodes['feedback'] ? (
                  <img 
                    src={qrCodes['feedback']} 
                    alt="QR Code for Feedback Page"
                    className="w-full max-w-[200px]"
                    data-testid="img-qr-feedback"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-muted animate-pulse rounded" />
                )}
              </div>
              <div className="text-code text-muted-foreground text-center break-all mb-4" data-testid="text-url-feedback">
                {window.location.origin}/feedback
              </div>
              <Button
                variant="outline"
                onClick={() => downloadQR('feedback', 'Share your thoughts', qrCodes['feedback'])}
                disabled={!qrCodes['feedback']}
                className="w-full h-10 text-body"
                data-testid="button-download-feedback"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
