import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Phone, MessageCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl sm:text-9xl font-bold text-primary/20 select-none">
              404
            </div>
          </div>
          
          {/* Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Sorry, the page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
          
          {/* Quick Links */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/services" className="text-primary hover:underline">
                Our Services
              </Link>
              <Link to="/dental-tourism" className="text-primary hover:underline">
                Dental Tourism
              </Link>
              <Link to="/pricing" className="text-primary hover:underline">
                Pricing
              </Link>
              <Link to="/doctors" className="text-primary hover:underline">
                Our Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;