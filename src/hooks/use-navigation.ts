import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
  id: string;
  label: string;
  url: string | null;
  page_id: string | null;
  parent_id: string | null;
  target: string | null;
  is_visible: boolean;
  sort_order: number;
  children?: NavItem[];
}

interface NavigationData {
  header: NavItem[];
  footer: NavItem[];
}

const defaultNavigation: NavigationData = {
  header: [
    { id: "1", label: "Home", url: "/", page_id: null, parent_id: null, target: null, is_visible: true, sort_order: 0 },
    { id: "2", label: "Services", url: "/services", page_id: null, parent_id: null, target: null, is_visible: true, sort_order: 1 },
    { id: "3", label: "Doctors", url: "/doctors", page_id: null, parent_id: null, target: null, is_visible: true, sort_order: 2 },
    { id: "4", label: "About", url: "/about", page_id: null, parent_id: null, target: null, is_visible: true, sort_order: 3 },
    { id: "5", label: "Dental Tourism", url: "/dental-tourism", page_id: null, parent_id: null, target: null, is_visible: true, sort_order: 4 },
    { id: "6", label: "Pricing", url: "/pricing", page_id: null, parent_id: null, target: null, is_visible: true, sort_order: 5 },
    { id: "7", label: "Reviews", url: "/reviews", page_id: null, parent_id: null, target: null, is_visible: true, sort_order: 6 },
  ],
  footer: [],
};

export function useNavigation() {
  const [navigation, setNavigation] = useState<NavigationData>(defaultNavigation);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*, page:pages(slug)")
        .eq("is_visible", true)
        .order("sort_order");

      if (error) throw error;

      if (data && data.length > 0) {
        const headerItems = data
          .filter((item) => item.location === "header" && !item.parent_id)
          .map((item) => ({
            ...item,
            url: item.url || (item.page?.slug ? `/${item.page.slug}` : null),
            children: data
              .filter((child) => child.parent_id === item.id)
              .map((child) => ({
                ...child,
                url: child.url || (child.page?.slug ? `/${child.page.slug}` : null),
              })),
          })) as NavItem[];

        const footerItems = data
          .filter((item) => item.location === "footer" && !item.parent_id)
          .map((item) => ({
            ...item,
            url: item.url || (item.page?.slug ? `/${item.page.slug}` : null),
          })) as NavItem[];

        setNavigation({
          header: headerItems.length > 0 ? headerItems : defaultNavigation.header,
          footer: footerItems,
        });
      }
    } catch (error) {
      console.error("Error fetching navigation:", error);
    } finally {
      setLoading(false);
    }
  };

  return { navigation, loading };
}
