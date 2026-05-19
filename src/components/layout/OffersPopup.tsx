import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOffers } from "@/hooks/use-offers";

export function OffersPopup() {
  const { offers, loading } = useOffers();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (loading || offers.length === 0) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 1500);
    return () => clearTimeout(t);
  }, [loading, offers.length]);

  if (offers.length === 0) return null;

  const offer = offers[index];
  if (!offer) return null;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      if (index < offers.length - 1) {
        setIndex((i) => i + 1);
        // keep open
        return;
      }
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden top-4 translate-y-0 sm:top-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl">Special Offer{offers.length > 1 ? ` (${index + 1}/${offers.length})` : ""}</DialogTitle>
          <DialogDescription>
            Exclusive deals and promotions just for you
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <div className="flex flex-col gap-4">
            {offer.image_url && (
              <div className="relative w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={offer.image_url}
                  alt={offer.image_alt || offer.title}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
                {offer.badge_text && (
                  <Badge className="absolute top-3 left-3">{offer.badge_text}</Badge>
                )}
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{offer.title}</h3>
              {offer.description && (
                <p className="text-muted-foreground">{offer.description}</p>
              )}
              <div className="flex gap-2 mt-2">
                {offer.cta_label && offer.cta_link && (
                  <Button asChild>
                    <Link to={offer.cta_link} onClick={() => setOpen(false)}>
                      {offer.cta_label}
                    </Link>
                  </Button>
                )}
                {index < offers.length - 1 && (
                  <Button variant="outline" onClick={() => setIndex((i) => i + 1)}>
                    Next Offer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
