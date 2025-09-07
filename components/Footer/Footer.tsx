// components/Footer/Footer.tsx
import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Hanus Oleg</p>
          <p>
            Contact us:{" "}
            <a href="mailto:oleg110770@gamil.com">oleg110770@gamil.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
