import Link from "next/link";
import { LetsMakeItWordmark, LmiMark } from "@/components/brand/Logo";
import { mainNav, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-sand" data-theme="dark">
      <div className="container-lux pb-10 pt-20 sm:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <LmiMark className="h-10 w-auto" />
            <p className="mt-8 max-w-sm text-lg leading-relaxed text-stone">Start your own software business. {site.tagline}</p>
            <p className="eyebrow mt-8 text-stone">Powered by {site.poweredBy}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3">
            <div>
              <h2 className="eyebrow mb-5 text-stone">Explore</h2>
              <ul className="space-y-3">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:underline hover:underline-offset-4">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/apply" className="hover:underline hover:underline-offset-4">
                    Apply
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-5 text-stone">Legal</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="hover:underline hover:underline-offset-4">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline hover:underline-offset-4">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h2 className="eyebrow mb-5 text-stone">Contact</h2>
              <ul className="space-y-3">
                <li>
                  <Link href="/apply" className="hover:underline hover:underline-offset-4">
                    Partner application
                  </Link>
                </li>
                {site.contact.email ? (
                  <li>
                    <a href={`mailto:${site.contact.email}`} className="break-all hover:underline hover:underline-offset-4">
                      {site.contact.email}
                    </a>
                  </li>
                ) : null}
                {site.contact.phone ? (
                  <li>
                    <a href={`tel:${site.contact.phone.replace(/\s+/g, "")}`} className="hover:underline hover:underline-offset-4">
                      {site.contact.phone}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </nav>
        </div>

        <LetsMakeItWordmark className="mt-24 h-auto w-full text-sand/95" />

        <div className="mt-10 flex flex-col gap-3 border-t border-line-dark pt-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} — {site.fullName}. Powered by {site.poweredBy}.
          </p>
          <p>Technology partner programme. Participation is subject to the partner agreement.</p>
        </div>
      </div>
    </footer>
  );
}
