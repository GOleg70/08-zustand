// import { ReactNode } from "react";

// export default function NotesFilterLayout({
//   children,
//   modal,
// }: {
//   children: ReactNode;
//   modal?: ReactNode;
// }) {
//   return (
//     <>
//       <section>{children}</section>
//       {modal}
//     </>
//   );
// }
import { ReactNode } from "react";
import css from "./layout.module.css";

interface NotesFilterLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode; 
  modal?: ReactNode; 
}

export default function NotesFilterLayout({
  children,
  sidebar,
  modal,
}: NotesFilterLayoutProps) {
  return (
    <>
      <div className={css.container}>
        <aside className={css.sidebar}>
          {sidebar}
        </aside>
        <section className={css.notesWrapper}>
          {children}
        </section>
      </div>
      {modal}
    </>
  );
}
