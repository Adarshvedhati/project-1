import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRIMARY_NAV, UTILITY_NAV } from "../../../constants/navigation";
import { useAuth } from "../../../features/auth/context/AuthContext";
import { SearchBar } from "../../ui";
import { MegaMenu } from "./MegaMenu";
import styles from "./Header.module.css";

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.utilityBar}>
        <div className={`container ${styles.utilityRow}`}>
          <span>Meridian Research</span>
          <nav className={styles.utilityNav} aria-label="Account">
            {isAuthenticated ? (
              <>
                <span>{user?.firstName}</span>
                <button type="button" onClick={signOut}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to={UTILITY_NAV.signIn.path}>{UTILITY_NAV.signIn.label}</Link>
                <Link to={UTILITY_NAV.register.path}>{UTILITY_NAV.register.label}</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className={`container ${styles.mainRow}`}>
        <Link to="/" className={styles.logo}>
          Meridian
        </Link>

        <button
          type="button"
          className={styles.mobileToggle}
          aria-expanded={mobileNavOpen}
          aria-controls="primary-nav"
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          {mobileNavOpen ? "Close" : "Menu"}
        </button>

        <nav
          id="primary-nav"
          className={`${styles.primaryNav} ${mobileNavOpen ? styles.primaryNavOpen : ""}`}
          aria-label="Primary"
        >
          {PRIMARY_NAV.map((item) => (
            <div
              key={item.path}
              className={styles.navItem}
              onMouseEnter={() => item.megaMenu && setOpenMenu(item.label)}
              onMouseLeave={() => item.megaMenu && setOpenMenu(null)}
            >
              <Link to={item.path} className={styles.navLink}>
                {item.label}
              </Link>
              {item.megaMenu && openMenu === item.label && <MegaMenu columns={item.megaMenu} />}
            </div>
          ))}
        </nav>
      </div>

      <div className={`container ${styles.searchRow}`}>
        <SearchBar
          onSearch={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
        />
      </div>
    </header>
  );
}
