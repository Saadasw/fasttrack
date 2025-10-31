import { Package, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-sidebar-primary" />
              <span className="text-2xl font-bold">FastTrack</span>
            </div>
            <p className="text-muted-foreground">
              Your trusted partner for reliable and fast courier services across the country.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-sidebar-primary transition-colors">
                  Ecommerce Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sidebar-primary transition-colors">
                  Pick and Drop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sidebar-primary transition-colors">
                  Packaging
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sidebar-primary transition-colors">
                  Warehousing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-sidebar-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sidebar-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sidebar-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sidebar-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@fasttrack.com.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 FastTrack Courier Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
