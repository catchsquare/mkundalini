import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOffers } from "@/hooks/use-offers";

const STORAGE_KEY = "offers_popup_shown";

export function OffersPopup() {
  const { offers, loading } = useOffers();
  const [open, setOpen] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl">Special Offers</DialogTitle>
          <DialogDescription>
            Exclusive deals and promotions just for you
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Carousel className="w-full">
            <CarouselContent>
              {offers.map((offer) => (
                <CarouselItem key={offer.id}>
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
                      {offer.cta_label && offer.cta_link && (
                        <Button asChild className="mt-2">
                          <Link to={offer.cta_link} onClick={() => setOpen(false)}>
                            {offer.cta_label}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {offers.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
