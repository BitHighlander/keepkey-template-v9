'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import styles from './page.module.css'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={styles.signOutButton}
          >
            Sign Out
          </button>
        </div>

        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>Welcome to Dashboard</h1>
          <p className={styles.subtitle}>Logged in as {session?.user?.email}</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Users</h3>
            <p className={styles.statNumber}>1,234</p>
          </div>
          <div className={styles.statCard}>
            <h3>Active Sessions</h3>
            <p className={styles.statNumber}>56</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Revenue</h3>
            <p className={styles.statNumber}>$45,678</p>
          </div>
          <div className={styles.statCard}>
            <h3>Growth</h3>
            <p className={styles.statNumber}>+12.3%</p>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <button className={styles.primary}>
            <Image
              src="/globe.svg"
              alt="Action icon"
              width={20}
              height={20}
              className={styles.actionIcon}
            />
            New Project
          </button>
          <button className={styles.secondary}>View Reports</button>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2024 Your Company. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
} 