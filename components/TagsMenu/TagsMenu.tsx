// "use client";

// import css from "./TagsMenu.module.css";
// import Link from "next/link";
// import { TAGS } from "@/lib/constants";

// export default function TagsMenu() {
//   return (
//     <div className={css.menuContainer}>
//       <button className={css.menuButton}>Notes ▾</button>
//       <ul className={css.menuList}>
//         {TAGS.map((tag) => (
//           <li key={tag} className={css.menuItem}>
//             <Link
//               href={`/notes/filter/${tag}`}
//               className={css.menuLink}
//               prefetch
//             >
//               {tag === "All" ? "All notes" : tag}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import css from "./TagsMenu.module.css";
import Link from "next/link";
import { TAGS } from "@/lib/constants";

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={css.menuContainer} ref={menuRef}>
      <button
        className={css.menuButton}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {TAGS.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${tag}`}
                className={css.menuLink}
                prefetch
                onClick={handleClose} // Закриває меню при кліку на посилання
              >
                {tag === "All" ? "All notes" : tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}