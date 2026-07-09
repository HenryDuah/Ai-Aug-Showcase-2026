import { useEffect, useState } from "react";
import { Link } from "wouter";
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
          dark: '#0a0a0a',
          light: '#ffffff',
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
        dark: '#0a0a0a',
        light: '#ffffff',
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
    <div className="min-h-[100dvh] bg-background pb-32">
      <div className="bg-secondary px-8 py-8 border-b border-border mb-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-sm" data-testid="button-back">
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Button>
            </Link>
            <div>
              <h1 className="text-display text-foreground flex items-center gap-4">
                <QrIcon className="h-8 w-8 text-muted-foreground" />
                QR codes
              </h1>
            </div>
          </div>
          <Button 
            onClick={downloadAllQRs}
            disabled={!allQRsReady}
            className="h-14 px-8 text-body rounded-sm"
            data-testid="button-download-all"
          >
            <Download className="h-5 w-5 mr-3" />
            {allQRsReady ? "Download all" : "Generating..."}
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectionsData.sections.map((section) => {
            const qrKey = `section-${section.id}`;
            return (
              <div key={section.id} className="border border-border bg-card rounded-sm" data-testid={`card-qr-${section.id}`}>
                <div className="p-8">
                  <div className="text-small font-mono text-muted-foreground mb-2">SEC 0{section.id}</div>
                  <h3 className="text-h3 text-foreground mb-8">
                    {section.name}
                  </h3>
                  <div className="bg-white p-6 rounded-sm flex items-center justify-center mb-8">
                    {qrCodes[qrKey] ? (
                      <img 
                        src={qrCodes[qrKey]} 
                        alt={`QR Code for ${section.name}`}
                        className="w-full max-w-[240px]"
                        data-testid={`img-qr-${section.id}`}
                      />
                    ) : (
                      <div className="w-[240px] h-[240px] bg-neutral-200 animate-pulse rounded-sm" />
                    )}
                  </div>
                  <div className="text-small font-mono text-muted-foreground text-center break-all mb-8 border border-border p-4 bg-background rounded-sm" data-testid={`text-url-${section.id}`}>
                    {window.location.origin}/section/{section.id}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => downloadQR(qrKey, section.name, qrCodes[qrKey])}
                    disabled={!qrCodes[qrKey]}
                    className="w-full h-12 text-body rounded-sm border-border hover:bg-white/5"
                    data-testid={`button-download-${section.id}`}
                  >
                    <Download className="h-4 w-4 mr-3 text-muted-foreground" />
                    Download PNG
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Feedback QR Code */}
          <div className="border border-border bg-card rounded-sm" data-testid="card-qr-feedback">
            <div className="p-8">
              <div className="text-small font-mono text-muted-foreground mb-2">GLOBAL</div>
              <h3 className="text-h3 text-foreground mb-8">
                Feedback
              </h3>
              <div className="bg-white p-6 rounded-sm flex items-center justify-center mb-8">
                {qrCodes['feedback'] ? (
                  <img 
                    src={qrCodes['feedback']} 
                    alt="QR Code for Feedback Page"
                    className="w-full max-w-[240px]"
                    data-testid="img-qr-feedback"
                  />
                ) : (
                  <div className="w-[240px] h-[240px] bg-neutral-200 animate-pulse rounded-sm" />
                )}
              </div>
              <div className="text-small font-mono text-muted-foreground text-center break-all mb-8 border border-border p-4 bg-background rounded-sm" data-testid="text-url-feedback">
                {window.location.origin}/feedback
              </div>
              <Button
                variant="outline"
                onClick={() => downloadQR('feedback', 'Share your thoughts', qrCodes['feedback'])}
                disabled={!qrCodes['feedback']}
                className="w-full h-12 text-body rounded-sm border-border hover:bg-white/5"
                data-testid="button-download-feedback"
              >
                <Download className="h-4 w-4 mr-3 text-muted-foreground" />
                Download PNG
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
