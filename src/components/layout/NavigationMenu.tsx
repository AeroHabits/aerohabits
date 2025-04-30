
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const routes = [
  { name: "Home", path: "/" },
  { name: "Habits", path: "/habits" },
  { name: "Goals", path: "/goals" },
  { name: "Journey", path: "/journey" },
  { name: "Challenges", path: "/challenges" },
]

export function MainNavigationMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="z-50"
    >
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger 
              className="bg-white/5 text-blue-100 hover:bg-white/10 hover:text-blue-50"
            >
              Menu
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 p-4 w-[200px] bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-xl">
                {routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className={cn(
                        "flex select-none items-center rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors",
                        "text-blue-100 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </motion.div>
  );
}
