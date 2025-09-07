"use client";

import css from "./SidebarNotes.module.css";
import Link from "next/link";
import { TAGS } from "@/lib/constants";

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      {TAGS.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag === "All" ? "All notes" : tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
