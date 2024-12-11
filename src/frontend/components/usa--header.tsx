import { useState } from 'react';
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import Image from "next/image";
import { Header, PrimaryNav, Search, NavMenuButton, Title } from "@trussworks/react-uswds";
import PGovLogo from '../assets/pgov-logo.svg';

export function USAHeader() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const onClick = (): void => setExpanded(prvExpanded => !prvExpanded);

  const menuItems = [
    <Link key="0" href="/" className={`usa-nav__link ${pathname === "/" ? "usa-current" : ""}`}>
      <span>Goals</span>
    </Link>,
    <Link key="1" href="/agencies" className={`usa-nav__link ${pathname.includes("/agencies") ? "usa-current" : ""}`}>
      <span>Agencies</span>
    </Link>,
  ];

  return(
    <Header basic={true} showMobileOverlay={expanded}>
       <div className="usa-nav-container padding-top-1">
          <div className="usa-navbar">
            <Title>
              <Image
                src={PGovLogo}
                width={56}
                height={56}
                alt={"Performance.gov logo"}
                priority
                className=""
              />
            </Title>
            <NavMenuButton onClick={onClick} label="Menu" />
          </div>
          <PrimaryNav items={menuItems} mobileExpanded={expanded} onToggleMobileNav={onClick}>
            <Search size="small" onSubmit={(e) => {e.preventDefault(); console.log("Search");}} />
          </PrimaryNav>
        </div>
    </Header>
  );
}
