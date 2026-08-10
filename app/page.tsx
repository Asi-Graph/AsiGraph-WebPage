"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Menu,
  X,
  Phone,
  MapPin,
  Mail,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  QrCode,
  Camera,
  AtSign,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import gsap from "gsap";
import { SlowMo } from "gsap/EasePack";

interface BubbleButtonProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit" | "reset";
}

function BubbleButton({ href, className = "", children, target, rel, onClick, type = "button" }: BubbleButtonProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(SlowMo);

    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button) return;

    const circlesTopLeft = Array.from(container.querySelectorAll<HTMLElement>(".circle.top-left"));
    const circlesBottomRight = Array.from(container.querySelectorAll<HTMLElement>(".circle.bottom-right"));
    const effectBtn = container.querySelector<HTMLElement>(".effect-button");

    // ── Top-left burst ──
    const tl = gsap.timeline();
    tl.set(circlesTopLeft, { x: 0, y: 0, rotation: -45, opacity: 1, scale: 1, scaleX: 1, scaleY: 1 });
    tl.to(circlesTopLeft, { duration: 1.2, x: -25, y: -25, scaleY: 2, ease: "slow(0.1, 0.7, false)" });
    tl.to(circlesTopLeft[0], { duration: 0.1, scale: 0.2, x: "+=6", y: "-=2" });
    tl.to(circlesTopLeft[1], { duration: 0.1, scaleX: 1, scaleY: 0.8, x: "-=10", y: "-=7" }, "<");
    tl.to(circlesTopLeft[2], { duration: 0.1, scale: 0.2, x: "-=15", y: "+=6" }, "<");
    tl.to(circlesTopLeft[0], { duration: 1, scale: 0, x: "-=5", y: "-=15", opacity: 0 });
    tl.to(circlesTopLeft[1], { duration: 1, scaleX: 0.4, scaleY: 0.4, x: "-=10", y: "-=10", opacity: 0 }, "<");
    tl.to(circlesTopLeft[2], { duration: 1, scale: 0, x: "-=15", y: "+=5", opacity: 0 }, "<");

    // ── Bottom-right burst ──
    const tl2 = gsap.timeline();
    tl2.set(circlesBottomRight, { x: 0, y: 0, rotation: 45, opacity: 1, scale: 1, scaleX: 1, scaleY: 1 });
    tl2.to(circlesBottomRight, { duration: 1.1, x: 30, y: 30, ease: "slow(0.1, 0.7, false)" });
    tl2.to(circlesBottomRight[0], { duration: 0.1, scale: 0.2, x: "-=6", y: "+=3" });
    tl2.to(circlesBottomRight[1], { duration: 0.1, scale: 0.8, x: "+=7", y: "+=3" }, "<");
    tl2.to(circlesBottomRight[2], { duration: 0.1, scale: 0.2, x: "+=15", y: "-=6" }, "<");
    tl2.to(circlesBottomRight[0], { duration: 1, scale: 0, x: "+=5", y: "+=15", opacity: 0 });
    tl2.to(circlesBottomRight[1], { duration: 1, scale: 0.4, x: "+=7", y: "+=7", opacity: 0 }, "<");
    tl2.to(circlesBottomRight[2], { duration: 1, scale: 0, x: "+=15", y: "-=5", opacity: 0 }, "<");

    // ── Master timeline – matches original timeScale(2.6) ──
    const mainTl = gsap.timeline({ paused: true, timeScale: 2.6 });
    mainTl.add(tl, 0);
    mainTl.to(effectBtn, { duration: 0.8, scaleY: 1.1 }, 0.1);
    mainTl.add(tl2, 0.2);
    mainTl.to(effectBtn, { duration: 1.8, scale: 1, ease: "elastic.out(1.2, 0.4)" }, 1.2);

    const handleMouseEnter = () => mainTl.restart();

    button.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      mainTl.kill();
    };
  }, []);

  return (
    <span ref={containerRef} className="button--bubble__container">
      {href ? (
        <a ref={buttonRef as any} href={href} className={`button button--bubble ${className}`} target={target} rel={rel}>
          {children}
        </a>
      ) : (
        <button ref={buttonRef as any} type={type} onClick={onClick} className={`button button--bubble ${className}`}>
          {children}
        </button>
      )}
      <span className="button--bubble__effect-container">
        <span className="circle top-left"></span>
        <span className="circle top-left"></span>
        <span className="circle top-left"></span>
        <span className="button effect-button"></span>
        <span className="circle bottom-right"></span>
        <span className="circle bottom-right"></span>
        <span className="circle bottom-right"></span>
      </span>
    </span>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);
  const videoSliderRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState("");
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number; opacity: number; color: string }>({ left: 0, width: 0, opacity: 0, color: "#00fbfb" });

  // Monitor scroll for header shade and active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const sectionIds = ["services", "about", "video-showcase", "projects", "features", "gallery", "contact"];
    const sectionElements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    sectionElements.forEach((el) => observer.observe(el));

    // Handle scroll back to top (hero / home section)
    const handleHeroScroll = () => {
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleHeroScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleHeroScroll);
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Update animated indicator line position and color based on activeSection
  useEffect(() => {
    if (!navContainerRef.current) return;
    const container = navContainerRef.current;
    const targetHref = activeSection ? `#${activeSection}` : "#";
    const activeLink = container.querySelector<HTMLAnchorElement>(`a[href="${targetHref}"]`);

    const sectionColors: Record<string, string> = {
      "": "#00fbfb",           // דף הבית (cyan)
      "services": "#ffe600",     // שירותים (yellow)
      "about": "#ff2a85",        // אודות (pink)
      "projects": "#4ade80",     // פרויקטים (green)
      "video-showcase": "#ff2a85", // מאחורי הקלעים (magenta)
      "features": "#00fbfb",     // הטכנולוגיה שלנו (cyan)
      "gallery": "#ffe600",      // גלריה (yellow)
      "contact": "#4ade80"       // צור קשר (green)
    };

    if (activeLink) {
      const linkRect = activeLink.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setUnderlineStyle({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
        opacity: 1,
        color: sectionColors[activeSection] || "#00fbfb"
      });
    } else {
      setUnderlineStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection]);

  // Intersection observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 }
    );

    const items = document.querySelectorAll(".reveal-item");
    items.forEach((item) => observer.observe(item));

    return () => {
      items.forEach((item) => observer.unobserve(item));
    };
  }, []);

  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // Auto-scroll slider when not hovering (RTL-aware infinite loop)
  useEffect(() => {
    if (isSliderHovered) return;

    const interval = setInterval(() => {
      if (!sliderRef.current) return;
      const container = sliderRef.current;
      const cardWidth = 480;

      const currentScroll = Math.abs(container.scrollLeft);
      const maxScroll = container.scrollWidth - container.clientWidth;

      // In RTL layout, scrolling towards the end of the list moves in negative left direction or towards maxScroll
      if (currentScroll >= maxScroll - 50) {
        // Loop back to the beginning
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Move towards the next cards
        // In standard RTL flex containers, scrollLeft is negative or scrollBy(-480) advances right to left
        const isRTL = getComputedStyle(container).direction === "rtl";
        container.scrollBy({ left: isRTL ? -cardWidth : cardWidth, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isSliderHovered]);

  // Service Slider manual controls (RTL aware)
  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const cardWidth = 480;
    const isRTL = getComputedStyle(container).direction === "rtl";

    if (direction === "left") {
      // Clicking left arrow in RTL should reveal items to the left (forward in RTL order)
      container.scrollBy({ left: isRTL ? -cardWidth : -cardWidth, behavior: "smooth" });
    } else {
      // Clicking right arrow in RTL should reveal items to the right (backward in RTL order)
      container.scrollBy({ left: isRTL ? cardWidth : cardWidth, behavior: "smooth" });
    }
  };

  const scrollVideoSlider = (direction: "left" | "right") => {
    if (!videoSliderRef.current) return;
    const container = videoSliderRef.current;
    const cardWidth = container.clientWidth * 0.85;
    const isRTL = getComputedStyle(container).direction === "rtl";

    if (direction === "left") {
      container.scrollBy({ left: isRTL ? -cardWidth : -cardWidth, behavior: "smooth" });
    } else {
      container.scrollBy({ left: isRTL ? cardWidth : cardWidth, behavior: "smooth" });
    }
  };

  const services = [
    {
      title: "הדפסת כרטיסי ביקור",
      badge: "הרושם הראשון קובע",
      subtitle: "כרטיס ביקור שמעביר את הרושם הנכון מהרגע הראשון.",
      desc: "מבחר סוגי נייר, גימורים יוקרתיים (לכה סלקטיבית, הבלטות, פויל זהב/כסף) והדפסה מדויקת ליצירת כרטיס שמייצג את העסק שלכם בצורה הטובה ביותר.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-FbBeZHY0mUTW4NC1d7F9rQal_SSekCne8Kp6az-yc6WC50Usf30Dl8W8TVkk3aV_MWLBYIGbLhs7XffkV6n8I3eGqGVRgpvN10JhW0rJC4A_PelUS1skZU9d1GuK-exBhVtI3du3KcVubXxI9kCFXUtpyJaODLnXCwYlbRFKmdt6C5AalxvtAmn8jl9-2sTn-JKoO6R_A6V4hFPD3Fm6th3FjR73I7y8goi-CFDZT35_RdfSBwoSCw0W4J9tPt8OK-HBsv3zl1E",
      glowClass: "glow-cyan hover:border-[#00fbfb]/50",
      textColor: "group-hover:text-[#00fbfb]",
      badgeColor: "bg-[#00fbfb]/10 text-[#00fbfb] border-[#00fbfb]/30"
    },
    {
      title: "הדפסת ברושורים",
      badge: "מציגים את העסק בצורה מקצועית",
      subtitle: "ספרו את הסיפור של העסק שלכם בצורה מקצועית.",
      desc: "ברושורים מעוצבים באיכות גבוהה המתאימים להצגת מוצרים, שירותים, פרויקטים ומידע שיווקי בצורה מרשימה וסוחפת.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXnbYBw2X9jc0-fCBIWnkeCIZ_-vBT1Y3RrzesRJG0hS5H_-X0fAfddUZtT5z-f25-kbGZh8mi5FqhudDiBlqMVgU9w7_dQjFtV7dEE33UTZgZ9euK-FGSX1cfSe3DUzDG3VhQmprnbHVwOo5SvFAQksI2GXI_AJVNxRpJyb1Mx3iVeIuxKXAHMyGoADek3oAvbOMX363-7UAEtscvXUFOlN3Msb6nZu3dBik0Fo3oU986mqmDUSaWKQwG8SJfyuKTfahilYF1sYM",
      glowClass: "glow-yellow hover:border-[#ffe600]/50",
      textColor: "group-hover:text-[#ffe600]",
      badgeColor: "bg-[#ffe600]/10 text-[#ffe600] border-[#ffe600]/30"
    },
    {
      title: "הדפסת קטלוגים",
      badge: "כל המוצרים במקום אחד",
      subtitle: "קטלוגים שמציגים את המוצרים שלכם בצורה מושלמת.",
      desc: "הדפסה איכותית עם מגוון כריכות, סוגי נייר וגימורים, ליצירת קטלוג שמעניק חוויית קריאה עשירה ומותיר רושם מקצועי לאורך זמן.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAikwJZrmbEP3orD3c80c_bQY4FL-VxaCmQSmxvHDjPy6gmw0Y2cTf6YYAKHkCrjQqiw-K9Ij2RUAYHdC5Qhzkjw5BZRq_NPvhIU1tbVvoq9BjtjPdDEpIimVQZiR5fuZ9i3LeJ3Ymdj5ReVamATOdXn_5E0MFNZY_FT-S9VRQXhvg8cW31p2QEJDLegcW-7K5MBJTk4rizF8sCSikVHKJMYm1ouqWRdXvzw1Y3AT8JA_YaJ1XH7BbAm4RpSRnsMHP-r4-dVGuHDDQ",
      glowClass: "glow-magenta hover:border-[#ff2a85]/50",
      textColor: "group-hover:text-[#ff2a85]",
      badgeColor: "bg-[#ff2a85]/10 text-[#ff2a85] border-[#ff2a85]/30"
    },
    {
      title: "הדפסת פולדרים",
      badge: "לכל פגישה עסקית",
      subtitle: "פתרון מקצועי להצגת מסמכים וחומרי שיווק.",
      desc: "פולדרים ממותגים בהתאמה אישית המשלבים עיצוב מוקפד, חומרי גלם איכותיים, כיסים ייעודיים וגימור ברמה הגבוהה ביותר.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfLAFnMs1xNIecqlenxMnQ_GbBcF5Gr7HIwuqIUPPTv_0C-nt_499vvvstjel-5or3H4xEzRyGmpblpxdQuat-BfUq9UNuz1AmTEtszWopUB9ssESpCIj4NrV7SRIBg-G3zg9_lM5Yz4-6HmDEyuw9fctqOv1MdF1TLTjLDmdqu_Cm8sClV2TvfH75IpjltBTrLywivIBNlGkPfnSoYTmwtCDdF-esCpVULe_EGbZkTNZgBtqgXmd9FlhEf5-PE1pWy_uwFuteDS8",
      glowClass: "glow-green hover:border-green-500/50",
      textColor: "group-hover:text-green-400",
      badgeColor: "bg-green-500/10 text-green-400 border-green-500/30"
    },
    {
      title: "הדפסת שלטים",
      badge: "נראות שמושכת תשומת לב",
      subtitle: "שלטים שמבליטים את העסק שלכם בכל מקום.",
      desc: "פתרונות שילוט בהתאמה אישית לעסקים, משרדים, חנויות, תערוכות ואירועים, תוך שימוש בחומרים איכותיים ועמידים לכל תנאי מזג אוויר.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPSMHJDKxOAXjA1dV_MjDU1VDEs-IsH4uWWyRnTShoOMxNYCkW679sLDUQ3FtadIjQFSYgbSvh_FnAHzxgsXN7nYNvqh7Elba_l8zC3WZX59HEFgkwFIBf0dwxzWsO5M2jnm8Nd6bWI6hAE1IsVTWJOPJT2ZXHS9mxrmmiho5_qmDLbgRCT6GSXsjb_fN3amitxF5deUY-D9eeUY5TSgmP1jWBM8nWKrJn8hdD4ju1dFhnF9AkLQvoj1dxG2pciqMFphFzeDX8ius",
      glowClass: "glow-cyan hover:border-[#00fbfb]/50",
      textColor: "group-hover:text-[#00fbfb]",
      badgeColor: "bg-[#00fbfb]/10 text-[#00fbfb] border-[#00fbfb]/30"
    },
    {
      title: "הדפסת מדבקות",
      badge: "מיתוג לכל מוצר",
      subtitle: "מדבקות בהתאמה מלאה לכל מטרה.",
      desc: "מדבקות בגלילים או בגיליונות, במגוון חומרים, צורות וגדלים, למיתוג מוצרים, אריזות, חלונות ראווה, רכבים וציוד.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMWNJXB15MK4ogYmO9ORbdZtQob78WlH_rujkyUBxAg1BR8pFD-GxWXPqqk5YewwAMYL4gyhZYDFNQOSTgEVxMzscmM53BYMT97b3mGS9-vKyOQR7VOqzU5aulJdcCwETV_GB9el7bl-Eu0laxGhF7OCD2TnV3MJJVGFX4ZvV3v86SqkZBOg1KERRd05LqRe2Fx68zv3xBLZycD6TcoVAv-sbhC-T5L-TqpAtwWXBBDwC-dVcTfOeXK2WYKu2OufXaRuyGMOfIbik",
      glowClass: "glow-yellow hover:border-[#ffe600]/50",
      textColor: "group-hover:text-[#ffe600]",
      badgeColor: "bg-[#ffe600]/10 text-[#ffe600] border-[#ffe600]/30"
    },
    {
      title: "הדפסת אריזות",
      badge: "חוויית מותג מהמבט הראשון",
      subtitle: "אריזות ממותגות שמוסיפות ערך למוצר שלכם.",
      desc: "עיצוב והדפסה של אריזות איכותיות המשלבות פונקציונליות, אסתטיקה גבוהה וחוויית פתיחה בלתי נשכחת ללקוח.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq1LLwxeqLPAVNK5NCOPTEVXKgW9u7BFS3pYhLe0-xowTA1y8fXn2wiLOiMDr689WLy6o3D9jr_x2VpDhFR_CnbmK2YR-pzF2axpt05haNhIhwfbYNRTL_6HIm8bPCHqSY4SexZplbeCk0sl8b59dlGphzyg8inAJAw7mQELWaEscfCwQbKcxfxhOodxPVrucErsuX9TsIT10hN0Y3NDZVKIat5eIejsrJpokol6N5ya6GwkOYbteGgvcmaiY8qMdVByuPQJsf2K4",
      glowClass: "glow-magenta hover:border-[#ff2a85]/50",
      textColor: "group-hover:text-[#ff2a85]",
      badgeColor: "bg-[#ff2a85]/10 text-[#ff2a85] border-[#ff2a85]/30"
    },
    {
      title: "הדפסת פוסטרים",
      badge: "מסרים גדולים. השפעה גדולה.",
      subtitle: "הדפסות גדולות עם נוכחות שאי אפשר לפספס.",
      desc: "פוסטרים באיכות גבוהה לקמפיינים, פרסום, אירועים, תערוכות ומיתוג חללים, עם צבעים חיים וחדות מרבית על סוגי נייר שונים.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCcF2CXiXN0AeRfSQ_JdcmPPHuvuKuoQ-PkvdEBIR1tlKhC-aH9kIcmVL8Pk4LGbxVXwjkQunq9jeTnW0DDAFvLz9MAFox-nBdRyMzRTgIvqIgkfvIYyKfA2JA_O2HFKx66O4pFBmOysAcNMRxBjTOqSXbZJB0kAAD7CWhKlQKM_8sz0km9argbgvKAhpU7v_Uu3LkWFMGew_6kv3mnot9MLM9KClr7O7n3MJmb-uX_a28tPg3bxr11lQACyPZC6KZrRIi0a9aXdw",
      glowClass: "glow-green hover:border-green-500/50",
      textColor: "group-hover:text-green-400",
      badgeColor: "bg-green-500/10 text-green-400 border-green-500/30"
    }
  ];

  const projects = [
    {
      title: "מיתוג למסעדת שף",
      category: "מיתוג קולינרי",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCcF2CXiXN0AeRfSQ_JdcmPPHuvuKuoQ-PkvdEBIR1tlKhC-aH9kIcmVL8Pk4LGbxVXwjkQunq9jeTnW0DDAFvLz9MAFox-nBdRyMzRTgIvqIgkfvIYyKfA2JA_O2HFKx66O4pFBmOysAcNMRxBjTOqSXbZJB0kAAD7CWhKlQKM_8sz0km9argbgvKAhpU7v_Uu3LkWFMGew_6kv3mnot9MLM9KClr7O7n3MJmb-uX_a28tPg3bxr11lQACyPZC6KZrRIi0a9aXdw",
      glowClass: "glow-magenta hover:border-[#ff2a85]/50",
      hoverColor: "group-hover:text-[#ff2a85]"
    },
    {
      title: "משרד עורכי דין פרימיום",
      category: "עיצוב עסקי",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPSMHJDKxOAXjA1dV_MjDU1VDEs-IsH4uWWyRnTShoOMxNYCkW679sLDUQ3FtadIjQFSYgbSvh_FnAHzxgsXN7nYNvqh7Elba_l8zC3WZX59HEFgkwFIBf0dwxzWsO5M2jnm8Nd6bWI6hAE1IsVTWJOPJT2ZXHS9mxrmmiho5_qmDLbgRCT6GSXsjb_fN3amitxF5deUY-D9eeUY5TSgmP1jWBM8nWKrJn8hdD4ju1dFhnF9AkLQvoj1dxG2pciqMFphFzeDX8ius",
      glowClass: "glow-cyan hover:border-[#00fbfb]/50",
      hoverColor: "group-hover:text-[#00fbfb]"
    }
  ];

  const galleryImages = [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMWNJXB15MK4ogYmO9ORbdZtQob78WlH_rujkyUBxAg1BR8pFD-GxWXPqqk5YewwAMYL4gyhZYDFNQOSTgEVxMzscmM53BYMT97b3mGS9-vKyOQR7VOqzU5aulJdcCwETV_GB9el7bl-Eu0laxGhF7OCD2TnV3MJJVGFX4ZvV3v86SqkZBOg1KERRd05LqRe2Fx68zv3xBLZycD6TcoVAv-sbhC-T5L-TqpAtwWXBBDwC-dVcTfOeXK2WYKu2OufXaRuyGMOfIbik",
      glowClass: "glow-cyan hover:border-[#00fbfb]/50"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq1LLwxeqLPAVNK5NCOPTEVXKgW9u7BFS3pYhLe0-xowTA1y8fXn2wiLOiMDr689WLy6o3D9jr_x2VpDhFR_CnbmK2YR-pzF2axpt05haNhIhwfbYNRTL_6HIm8bPCHqSY4SexZplbeCk0sl8b59dlGphzyg8inAJAw7mQELWaEscfCwQbKcxfxhOodxPVrucErsuX9TsIT10hN0Y3NDZVKIat5eIejsrJpokol6N5ya6GwkOYbteGgvcmaiY8qMdVByuPQJsf2K4",
      glowClass: "glow-magenta hover:border-[#ff2a85]/50"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlwVgQNiuBA_rZJ5aVaxDq3uU0nGS2nUr9JNQXvE5584Zj69SObE7VZgPwCo-RxMT_RIjjRDO-Dfkbo463DjLDmMqCyEz_pEu4aA9FaSM-i2DEsLB6JEL3Yhq4_3ZmRZVELjY95zTj6MQLjk39Rt-lkGGYP0y9PUZ5WgXK-xRWc3hv3Obq4ND5ZZIp2OP1ijrkCS7dIg8HMh31Npmeo0DgxEopEQSBRfmkpBQJqOhSO8fmMDBSdRtcS0ukI3G_LOnEdB0v9SubNd4",
      glowClass: "glow-yellow hover:border-[#ffe600]/50"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMEOQlyI6sTNyngY8DcmgC7fxL2574xlxhN7A9zijGliE00P-Kq0m2-MQCghagiGBQxF5Kahrzg8LKlRs8JtaFgk29YVmZxHNg8xXjBdRvcLWpp8Pk_5FhwvaZfLrEuMb2J_yz10__z8bNPTX_eovaFjSqxCAYMIsMPt8jo2BYykKiKtnWil7mfeYrILhlBDvOUHo6CL7J0y0Q00e6Oav7fSM4jhSgddVl3ewg3qz0qkikFeSnnFPETIF_lpmHtIFVwWG1RqDyQhw",
      glowClass: "glow-green hover:border-green-500/50"
    }
  ];

  return (
    <div className="min-h-screen text-[#e3e2e2] bg-[#121414] font-sans selection:bg-[#00fbfb] selection:text-[#002020] relative">
      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-8 left-8 p-3 text-white hover:text-[#00fbfb] transition-colors"
          >
            <X size={32} />
          </button>
          <div className="w-full max-w-2xl text-center">
            <h3 className="font-display text-2xl md:text-3xl mb-8 font-bold">מה תרצו לחפש?</h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="הקלידו מילת חיפוש..."
                className="w-full bg-transparent border-b-2 border-white/20 focus:border-[#00fbfb] py-4 px-2 text-xl outline-none text-white text-center transition-colors placeholder:text-white/40"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={24} />
            </div>
            {searchQuery && (
              <div className="mt-8 text-right bg-white/5 p-4 rounded-lg">
                <p className="text-sm text-white/60">תוצאות חיפוש עבור &quot;{searchQuery}&quot;...</p>
                <div className="mt-4 text-white">לא נמצאו תוצאות תואמות.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <nav className={`fixed top-0 w-full z-50 glass-header border-b border-white/10 transition-all duration-300 ${scrolled ? "shadow-xl bg-[#121414]/95 py-2.5" : "bg-[#121414]/80 py-3.5"
        }`}>
        <div className="flex justify-between items-center px-6 md:px-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center group cursor-pointer">
            <img src="/logo.png" alt="אסיגרף לוגו" className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </div>

          <div ref={navContainerRef} className="hidden lg:flex flex-row gap-8 items-center relative py-1">
            <a className={`font-sans transition-colors duration-300 pb-1 hover-cmyk-cyan ${activeSection === "" ? "text-white font-semibold" : "text-white/70"}`} href="#">דף הבית</a>
            <a className={`font-sans transition-colors duration-300 pb-1 hover-cmyk-yellow ${activeSection === "services" ? "text-white font-semibold" : "text-white/70"}`} href="#services">שירותים</a>
            <a className={`font-sans transition-colors duration-300 pb-1 hover-cmyk-magenta ${activeSection === "about" ? "text-white font-semibold" : "text-white/70"}`} href="#about">אודות</a>
            <a className={`font-sans transition-colors duration-300 pb-1 hover-cmyk-green ${activeSection === "projects" ? "text-white font-semibold" : "text-white/70"}`} href="#projects">פרויקטים</a>
            <a className={`font-sans transition-colors duration-300 pb-1 hover-cmyk-magenta ${activeSection === "video-showcase" ? "text-white font-semibold" : "text-white/70"}`} href="#video-showcase">מאחורי הקלעים</a>
            <a className={`font-sans transition-colors duration-300 pb-1 hover-cmyk-cyan ${activeSection === "features" ? "text-white font-semibold" : "text-white/70"}`} href="#features">הטכנולוגיה שלנו</a>
            <a className={`font-sans transition-colors duration-300 pb-1 hover-cmyk-yellow ${activeSection === "gallery" ? "text-white font-semibold" : "text-white/70"}`} href="#gallery">גלריה</a>
            <a className={`font-sans transition-colors duration-300 pb-1 hover-cmyk-green ${activeSection === "contact" ? "text-white font-semibold" : "text-white/70"}`} href="#contact">צור קשר</a>

            {/* Sliding Underline Indicator */}
            <span
              className="absolute bottom-0 h-0.5 rounded-full transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
                opacity: underlineStyle.opacity,
                backgroundColor: underlineStyle.color
              }}
            />
          </div>

          <div className="flex items-center gap-6">
            <a href="tel:0543183186" className="hidden md:block font-sans text-white font-bold hover-cmyk-cyan transition-colors">
              0543183186
            </a>
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white hover:text-[#00fbfb] transition-colors p-1"
            >
              <Search size={22} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-white hover:text-[#00fbfb] transition-colors p-1"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-50 bg-black/95 transition-transform duration-500 transform ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden flex flex-col justify-between p-8`}>
        <div>
          <div className="flex justify-between items-center mb-16">
            <span className="font-display text-2xl font-bold text-white">אסיגרף</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
              <X size={32} />
            </button>
          </div>
          <div className="flex flex-col gap-6 text-2xl text-right">
            <a onClick={() => setMobileMenuOpen(false)} className="font-display font-semibold text-[#00fbfb]" href="#">דף הבית</a>
            <a onClick={() => setMobileMenuOpen(false)} className="font-display text-white/80 hover:text-white hover-cmyk-magenta" href="#services">שירותים</a>
            <a onClick={() => setMobileMenuOpen(false)} className="font-display text-white/80 hover:text-white hover-cmyk-yellow" href="#about">אודות</a>
            <a onClick={() => setMobileMenuOpen(false)} className="font-display text-white/80 hover:text-white hover-cmyk-green" href="#projects">פרויקטים</a>
            <a onClick={() => setMobileMenuOpen(false)} className="font-display text-white/80 hover:text-white hover-cmyk-magenta" href="#video-showcase">מאחורי הקלעים</a>
            <a onClick={() => setMobileMenuOpen(false)} className="font-display text-white/80 hover:text-white hover-cmyk-cyan" href="#features">הטכנולוגיה שלנו</a>
            <a onClick={() => setMobileMenuOpen(false)} className="font-display text-white/80 hover:text-white hover-cmyk-yellow" href="#gallery">גלריה</a>
            <a onClick={() => setMobileMenuOpen(false)} className="font-display text-white/80 hover:text-white hover-cmyk-green" href="#contact">צור קשר</a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col gap-4 text-right">
          <a href="tel:0543183186" className="text-xl font-bold text-white flex items-center gap-3 justify-end">
            <span>0543183186</span>
            <Phone size={20} className="text-[#00fbfb]" />
          </a>
          <p className="text-white/60 text-sm">אחד העם 3, תל אביב</p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col md:flex-row md:items-center justify-start overflow-hidden pt-24 md:pt-28 pb-16">
        {/* Background Video for Desktop */}
        <div className="hidden md:block absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover scale-105"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            {/* Lighter Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/65 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121414] via-transparent to-black/40" />
            <div className="absolute inset-0 bg-black/15" />
          </div>
        </div>

        <div className="relative z-10 w-full px-6 md:px-16 max-w-7xl mx-auto flex flex-col">
          <div className="max-w-6xl text-right">
            <h1 className="font-display font-black text-white mb-6 leading-tight">
              <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
                דפוס מקצועי שמתחיל בניסיון.
              </span>
              <span className="block mt-3 text-xl sm:text-2xl md:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#00fbfb] via-[#ff2a85] to-[#ffe600] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
                ונגמר בתוצאה מושלמת.
              </span>
            </h1>
            <p className="font-sans text-white/90 text-base md:text-xl leading-relaxed mb-6 md:mb-8 font-normal max-w-4xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              מאז שנות ה־70 עולם הדפוס הוא חלק מהמשפחה שלנו. <br />באסיגרף, <strong className="text-[#00fbfb] font-bold">בית דפוס בתל אביב בשכונת נווה צדק</strong>, אנו משלבים ניסיון של עשרות שנים, טכנולוגיית <strong className="text-[#ffe600] font-bold">דפוס אופסט ודיגיטלי</strong> מתקדמת ופתרונות <strong className="text-[#ff2a85] font-bold">גימור וכריכה</strong> איכותיים ושירות אישי כדי להפוך כל רעיון למוצר מודפס ברמה הגבוהה ביותר.
            </p>

            {/* Video specifically placed below text content on Mobile */}
            <div className="block md:hidden w-full my-6 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative aspect-video">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-start mb-8">
              <BubbleButton href="#contact">
                קבלו הצעת מחיר
              </BubbleButton>
              <BubbleButton href="https://wa.me/972543183186?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%A2%D7%A9%D7%95%D7%AA%20%D7%A2%D7%91%D7%95%D7%93%D7%AA%20%D7%93%D7%A4%D7%95%D7%A1" target="_blank" rel="noopener noreferrer">
                <span className="flex items-center gap-3 justify-center">
                  <span>דברו איתנו בוואטסאפ</span>
                  <img src="/whatsapp.svg" alt="WhatsApp" className="w-5 h-5 object-contain" />
                </span>
              </BubbleButton>
            </div>
            {/* Small Trust Text */}
            <div className="flex flex-wrap gap-8 justify-start items-center text-white text-base md:text-lg font-bold font-sans">
              <span className="flex items-center gap-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                <span className="text-[#00fbfb]">✔</span> מעל 40 שנות ניסיון
              </span>
              <span className="flex items-center gap-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                <span className="text-[#ff2a85]">✔</span> שירות לכל הארץ
              </span>
              <span className="flex items-center gap-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                <span className="text-[#ffe600]">✔</span> פתרונות דפוס בהתאמה אישית
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="rotate-90 text-[#00fbfb]" size={36} />
        </div>
      </section>

      {/* Service Rail Section */}
      <section id="services" className="py-24 md:py-32 bg-[#121414] overflow-hidden">
        <div className="px-6 md:px-16 max-w-7xl mx-auto mb-16 flex justify-between items-end">
          <div className="text-right max-w-3xl">
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4">פתרונות דפוס לכל צורך</h2>
            <p className="font-sans text-white/70 text-lg md:text-xl leading-relaxed font-light">
              מכרטיס ביקור ועד פרויקט רחב היקף – אנחנו מלווים אתכם משלב הרעיון ועד למוצר המוגמר.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => scrollSlider("right")}
              className="p-4 border border-white/20 hover:border-[#ff2a85] hover:text-[#ff2a85] transition-colors rounded-full text-white cursor-pointer"
              aria-label="גלול ימינה"
            >
              <ChevronRight size={24} />
            </button>
            <button
              onClick={() => scrollSlider("left")}
              className="p-4 border border-white/20 hover:border-[#00fbfb] hover:text-[#00fbfb] transition-colors rounded-full text-white cursor-pointer"
              aria-label="גלול שמאלה"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          onMouseEnter={() => setIsSliderHovered(true)}
          onMouseLeave={() => setIsSliderHovered(false)}
          className="flex gap-6 overflow-x-auto pb-12 px-6 md:px-16 custom-scroll snap-x scroll-smooth scrollbar-none"
        >
          {services.map((service, index) => (
            <div key={index} className="min-w-[320px] md:min-w-[460px] group cursor-pointer snap-start text-right flex flex-col justify-between">
              <div>
                <div className={`relative h-[380px] md:h-[440px] rounded-2xl overflow-hidden mb-6 border border-white/5 ${service.glowClass}`}>
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-all duration-300" />

                  {/* Tagline Badge on top of Card */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-sans border backdrop-blur-md ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>
                </div>

                <h3 className={`font-display text-white text-2xl font-black mb-2 transition-colors ${service.textColor}`}>
                  {service.title}
                </h3>

                <p className="font-sans text-white font-medium text-base mb-2 leading-snug">
                  {service.subtitle}
                </p>

                <p className="font-sans text-white/70 text-sm leading-relaxed max-w-md font-light">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Promotion */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxKEEdrQMihVaj1bRSgdw3qOaGDpTfTJPn_uA-Mz4hPrF67OaK8p1q_ZblkwBzqJSmK-bsgZ8tJe8cRMdhiRQBDl6O1m0n9WL6pd43TPUDwQsJ4Hm5ATaBJ12vTwgRApCsX9fEPmRWemCYQ7LoTlgG4yJiADJ4PNzIZAdZcwdXCDrNOhm2ySaTZ-B4hQu2lqt5EnMsLfGuYSKZ2uDcMzAg6WYClr9xH9DJ8m8Taf2718yHXdiOypATFmRpm3IWbl15eS5mQeXqBRc"
            alt="קטלוגים עילית"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#121414]/75 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 px-6 text-center max-w-4xl reveal-item">
          <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            לא רק מדפיסים.<br />
            <span className="text-[#00fbfb]">מלווים אתכם לאורך כל הדרך.</span>
          </h2>
          <p className="font-sans text-white/80 text-lg md:text-2xl leading-relaxed mb-10 font-light max-w-3xl mx-auto">
            כל עבודה מתחילה בהקשבה. <br />כמובילים בתחום <strong>בית דפוס בתל אביב</strong>, אנחנו ממליצים על החומרים המתאימים, בוחרים בין <strong>דפוס דיגיטלי</strong> מהיר לבין <strong>דפוס אופסט</strong> להפקות ענק, ומוודאים שהתוצאה תהיה בדיוק כפי שדמיינתם.
          </p>
          <BubbleButton href="#contact">
            קבלו ייעוץ מקצועי
          </BubbleButton>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="about" className="py-24 md:py-32 bg-[#121414] border-t border-white/5 relative overflow-hidden">
        <div className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-item">
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4">למה בוחרים באסיגרף?</h2>
            <p className="font-sans text-white/70 text-lg md:text-xl font-light max-w-2xl mx-auto">
              בית דפוס בתל אביב עם מסורת של מצוינות, ציוד מתקדם ויחס אישי לכל פרויקט.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 reveal-item">
            <div className="glass-card p-4 md:p-8 rounded-xl md:rounded-2xl text-right border border-white/5 hover:border-[#00fbfb]/30 transition-all duration-300 hover:-translate-y-1">
              <span className="text-[#00fbfb] font-display text-lg md:text-2xl font-black block mb-2 md:mb-3">40+ שנות ניסיון</span>
              <p className="text-white/80 text-xs md:text-base font-sans leading-relaxed">
                ידע שנצבר במשך עשורים רבים בעולם הדפוס. ניסיון משפחתי שעובר בין דורות ומבטיח פתרונות מיומנים לכל אתגר.
              </p>
            </div>

            <div className="glass-card p-4 md:p-8 rounded-xl md:rounded-2xl text-right border border-white/5 hover:border-[#ffe600]/30 transition-all duration-300 hover:-translate-y-1">
              <span className="text-[#ffe600] font-display text-lg md:text-2xl font-black block mb-2 md:mb-3">ציוד מתקדם</span>
              <p className="text-white/80 text-xs md:text-base font-sans leading-relaxed">
                מכונות מהמתקדמות בעולם בעולם הדפוס הדיגיטלי והדפוס אופסט לקבלת תוצאות מושלמות בכל קנה מידה.
              </p>
            </div>

            <div className="glass-card p-4 md:p-8 rounded-xl md:rounded-2xl text-right border border-white/5 hover:border-[#ff2a85]/30 transition-all duration-300 hover:-translate-y-1">
              <span className="text-[#ff2a85] font-display text-lg md:text-2xl font-black block mb-2 md:mb-3">דיוק בכל פרט</span>
              <p className="text-white/80 text-xs md:text-base font-sans leading-relaxed">
                בקרת איכות קפדנית ביותר בכל שלב – משלב קדם הדפסה והתאמת קבצים ועד הגימור הסופי והאריזה.
              </p>
            </div>

            <div className="glass-card p-4 md:p-8 rounded-xl md:rounded-2xl text-right border border-white/5 hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1">
              <span className="text-green-400 font-display text-lg md:text-2xl font-black block mb-2 md:mb-3">שירות אישי</span>
              <p className="text-white/80 text-xs md:text-base font-sans leading-relaxed">
                אנחנו זמינים, קשובים ומלווים כל לקוח מקרוב בגובה העיניים – מעסקים קטנים ועד חברות ענק.
              </p>
            </div>

            <div className="glass-card p-4 md:p-8 rounded-xl md:rounded-2xl text-right border border-white/5 hover:border-[#00fbfb]/30 transition-all duration-300 hover:-translate-y-1">
              <span className="text-[#00fbfb] font-display text-lg md:text-2xl font-black block mb-2 md:mb-3">פתרונות בהתאמה אישית</span>
              <p className="text-white/80 text-xs md:text-base font-sans leading-relaxed">
                אין שתי עבודות זהות. גם הפתרון שלנו לא. אנחנו התאמנו פתרונות הדפסה ייחודיים לצרכים הספציפיים שלכם.
              </p>
            </div>

            <div className="glass-card p-4 md:p-8 rounded-xl md:rounded-2xl text-right border border-white/5 hover:border-[#ffe600]/30 transition-all duration-300 hover:-translate-y-1">
              <span className="text-[#ffe600] font-display text-lg md:text-2xl font-black block mb-2 md:mb-3">משלוחים לכל הארץ</span>
              <p className="text-white/80 text-xs md:text-base font-sans leading-relaxed">
                מייצרים בבית דפוס בתל אביב ומגיעים לכל מקום בארץ במהירות ובבטחה.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-24 md:py-32 bg-[#0d0e0f]">
        <div className="px-6 md:px-16 max-w-7xl mx-auto mb-16 text-right">
          <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4">עבודות שאנחנו גאים בהן</h2>
          <p className="font-sans text-white/70 text-lg md:text-xl font-light max-w-3xl leading-relaxed mb-6">
            כל פרויקט מספר סיפור אחר. <br /> זו ההזדמנות שלכם לראות את רמת הגימור, איכות ההדפסה והירידה לפרטים שמאפיינת כל עבודה שלנו.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00fbfb] via-[#ff2a85] to-[#ffe600]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-16 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <div key={index} className="reveal-item group text-right">
              <div className={`relative aspect-[16/9] overflow-hidden mb-8 rounded-2xl border border-white/5 ${project.glowClass}`}>
                <img
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
              </div>
              <div className="flex justify-between items-start flex-row-reverse">
                <div>
                  <span className="font-display text-sm text-white/50 mb-2 block">{project.category}</span>
                  <h3 className={`font-display text-white text-2xl font-bold transition-colors ${project.hoverColor}`}>{project.title}</h3>
                </div>
                <ArrowLeft className={`text-white transition-all duration-300 transform group-hover:-translate-x-3 ${project.hoverColor}`} size={32} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Production Video Showcase Section - מאחורי הקלעים / הייצור שלנו בלייב */}
      <section id="video-showcase" className="py-24 md:py-32 bg-gradient-to-b from-[#0d0e0f] via-[#121414] to-[#0d0e0f] border-t border-b border-white/5 relative overflow-hidden">
        {/* Glow ambient background accents */}
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-[#00fbfb]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-[#ff2a85]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal-item">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold font-sans border bg-[#00fbfb]/10 text-[#00fbfb] border-[#00fbfb]/30 mb-4">
              🎥 מאחורי הקלעים בזמן אמת
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4">
              ראו את הציוד והצוות שלנו בפעולה
            </h2>
            <p className="font-sans text-white/70 text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed">
              הצצה חיה אל מכונות הדפוס, הגימורים והדיוק שעומדים מאחורי כל מוצר שיוצא מבית דפוס אסיגרף.
            </p>
          </div>

          {/* Video Showcase Container: Carousel on mobile, Grid on md+ */}
          <div className="relative group">
            {/* Mobile Nav Arrows */}
            <div className="flex md:hidden justify-between items-center mb-4 px-2">
              <span className="text-white/60 text-xs font-sans">החליקו לצפייה בסרטונים ◄</span>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollVideoSlider("right")}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-[#00fbfb] hover:text-black transition-colors"
                  aria-label="הקודם"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => scrollVideoSlider("left")}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-[#00fbfb] hover:text-black transition-colors"
                  aria-label="הבא"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>

            <div
              ref={videoSliderRef}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible overflow-y-hidden touch-pan-x overscroll-x-contain snap-x snap-mandatory scrollbar-none pb-4 md:pb-0"
            >
              {[
                {
                  title: "דפוס אופסט מתקדם 1",
                  category: "הדפסה בהיקף נרחב",
                  video: "/videos/offset-printing.mp4",
                  desc: "הרצת מכונת האופסט והזנת הנייר בדיוק המרבי.",
                  glow: "glow-cyan hover:border-[#00fbfb]/50",
                  accent: "text-[#00fbfb]"
                },
                {
                  title: "מכונת דפוס אופסט בפעולה",
                  category: "ציוד הדפסה",
                  video: "/videos/offset-machine.mp4",
                  desc: "מבט מקרוב על תנועת הגלילים ואיכות מעבר הצבע.",
                  glow: "glow-cyan hover:border-[#00fbfb]/50",
                  accent: "text-[#00fbfb]"
                },
                {
                  title: "כיול והתחלת הדפסה",
                  category: "הכנה למכונה",
                  video: "/videos/print-start.mp4",
                  desc: "בדיקת הקבצים והזנת הנייר לקבלת חדות גבוהה.",
                  glow: "glow-yellow hover:border-[#ffe600]/50",
                  accent: "text-[#ffe600]"
                },
                {
                  title: "בקרת איכות ודיוק צבע",
                  category: "איכות ללא פשרות",
                  video: "/videos/color-check.mp4",
                  desc: "השוואה והתאמת גווני הדפסה לתקן CMYK מושלם.",
                  glow: "glow-magenta hover:border-[#ff2a85]/50",
                  accent: "text-[#ff2a85]"
                },
                {
                  title: "מכונת קיפול מקצועית",
                  category: "גימור וקיפול",
                  video: "/videos/folding-machine.mp4",
                  desc: "קיפול אוטומטי מהיר של פרוספקטים, ברושורים ומפות.",
                  glow: "glow-yellow hover:border-[#ffe600]/50",
                  accent: "text-[#ffe600]"
                },
                {
                  title: "הדבקות ומארזים",
                  category: "הדבקות וקווי גימור",
                  video: "/videos/gluing.mp4",
                  desc: "הדבקה ממוחשבת לפולדרים, קופסאות ומארזי פרימיום.",
                  glow: "glow-green hover:border-green-500/50",
                  accent: "text-green-400"
                },
                {
                  title: "חיתוך גיליונות מהיר",
                  category: "חיתוך וגימור",
                  video: "/videos/fast-cutting.mp4",
                  desc: "חיתוך גיליונות נייר ממוחשב ברמת דיוק של מילימטר.",
                  glow: "glow-cyan hover:border-[#00fbfb]/50",
                  accent: "text-[#00fbfb]"
                },
                {
                  title: "חיתוך צורני ושבלונות 1",
                  category: "עיבוד צורני",
                  video: "/videos/die-cutting-1.mp4",
                  desc: "חיתוך מדויק של מדבקות, פולדרים ומארזים.",
                  glow: "glow-magenta hover:border-[#ff2a85]/50",
                  accent: "text-[#ff2a85]"
                },
                {
                  title: "חיתוך צורני שטנץ 2",
                  category: "עיבוד צורני",
                  video: "/videos/die-cutting-2.mp4",
                  desc: "יצירת פינות מעוגלות וצורות מיוחדות לפי דרישה.",
                  glow: "glow-yellow hover:border-[#ffe600]/50",
                  accent: "text-[#ffe600]"
                },
                {
                  title: "חיתוך צורני בלייזר 3",
                  category: "עיבוד צורני",
                  video: "/videos/die-cutting-3.mp4",
                  desc: "חיתוך צורני מתקדם לכרטיסים ומבנים מורכבים.",
                  glow: "glow-cyan hover:border-[#00fbfb]/50",
                  accent: "text-[#00fbfb]"
                },
                {
                  title: "ציפוי למינציה יוקרתי",
                  category: "גימור והגנה",
                  video: "/videos/lamination.mp4",
                  desc: "ציפוי מט/מבריק לשמירה עמידה ומראה מרשים.",
                  glow: "glow-green hover:border-green-500/50",
                  accent: "text-green-400"
                },
                {
                  title: "תפירה וכריכת קטלוגים",
                  category: "כריכייה מקצועית",
                  video: "/videos/sewing.mp4",
                  desc: "גימור תפירת פשתן או סיכות לקטלוגים עמידים.",
                  glow: "glow-magenta hover:border-[#ff2a85]/50",
                  accent: "text-[#ff2a85]"
                },
                {
                  title: "ייצור לוחות שנה ומחברות",
                  category: "מוצרי ניר",
                  video: "/videos/calendar.mp4",
                  desc: "הדפסה והרכבה של לוחות שנה שולחניים וקיריים.",
                  glow: "glow-cyan hover:border-[#00fbfb]/50",
                  accent: "text-[#00fbfb]"
                },
                {
                  title: "הצגת מוצרים מוגמרים",
                  category: "תוצר סופי",
                  video: "/videos/products.mp4",
                  desc: "מבחר קטלוגים, ברושורים ומארזים מוכנים.",
                  glow: "glow-yellow hover:border-[#ffe600]/50",
                  accent: "text-[#ffe600]"
                },
                {
                  title: "אריזה קפדנית למשלוח",
                  category: "הפצה ומשלוחים",
                  video: "/videos/packaging.mp4",
                  desc: "אריזה מוגנת והכנה למשלוחים מהירים לכל הארץ.",
                  glow: "glow-green hover:border-green-500/50",
                  accent: "text-green-400"
                },
                {
                  title: "סיור במפעל הדפוס בתל אביב",
                  category: "הבית שלנו",
                  video: "/videos/entrance.mp4",
                  desc: "40 שנות ניסיון משפחתי תחת קורת גג אחת.",
                  glow: "glow-cyan hover:border-[#00fbfb]/50",
                  accent: "text-[#00fbfb]"
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`group relative bg-[#181a1b] rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 ${item.glow} reveal-item text-right flex flex-col justify-between shrink-0 w-[82vw] max-w-[320px] md:w-auto md:max-w-none snap-align-start`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    >
                      <source src={item.video} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181a1b] via-transparent to-black/30 pointer-events-none" />
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-sans bg-black/60 backdrop-blur-md text-white/90 border border-white/10">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className={`font-display text-lg md:text-xl font-bold mb-2 text-white group-hover:${item.accent} transition-colors`}>
                        {item.title}
                      </h3>
                      <p className="font-sans text-white/70 text-xs md:text-sm font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Color Accuracy Section */}
      <section id="features" className="bg-[#121414] py-24 md:py-32 overflow-hidden">
        {/* Technology Block */}
        <div className="flex flex-col lg:flex-row items-center mb-24 lg:mb-32">
          <div className="w-full lg:w-1/2 reveal-item relative overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPSMHJDKxOAXjA1dV_MjDU1VDEs-IsH4uWWyRnTShoOMxNYCkW679sLDUQ3FtadIjQFSYgbSvh_FnAHzxgsXN7nYNvqh7Elba_l8zC3WZX59HEFgkwFIBf0dwxzWsO5M2jnm8Nd6bWI6hAE1IsVTWJOPJT2ZXHS9mxrmmiho5_qmDLbgRCT6GSXsjb_fN3amitxF5deUY-D9eeUY5TSgmP1jWBM8nWKrJn8hdD4ju1dFhnF9AkLQvoj1dxG2pciqMFphFzeDX8ius"
              alt="טכנולוגיית דפוס מתקדמת"
              className="w-full h-[500px] md:h-[600px] object-cover asymmetric-clip-right opacity-90"
              loading="lazy"
            />
          </div>
          <div className="w-full lg:w-1/2 px-6 md:px-16 py-12 text-right reveal-item">
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              הטכנולוגיה משתנה.<br />
              <span className="text-[#ffe600]">המחויבות שלנו לא.</span>
            </h2>
            <p className="font-sans text-white/80 text-lg md:text-xl leading-relaxed max-w-lg font-light">
              אנחנו משלבים בין ניסיון של עשרות שנים לבין ציוד הדפסה מתקדם, כדי להבטיח צבעים מדויקים, חדות מרבית ותוצאה שמכבדת את המותג שלכם.
            </p>
          </div>
        </div>

        {/* Color Accuracy Block */}
        <div className="flex flex-col lg:flex-row-reverse items-center">
          <div className="w-full lg:w-1/2 reveal-item relative overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlwVgQNiuBA_rZJ5aVaxDq3uU0nGS2nUr9JNQXvE5584Zj69SObE7VZgPwCo-RxMT_RIjjRDO-Dfkbo463DjLDmMqCyEz_pEu4aA9FaSM-i2DEsLB6JEL3Yhq4_3ZmRZVELjY95zTj6MQLjk39Rt-lkGGYP0y9PUZ5WgXK-xRWc3hv3Obq4ND5ZZIp2OP1ijrkCS7dIg8HMh31Npmeo0DgxEopEQSBRfmkpBQJqOhSO8fmMDBSdRtcS0ukI3G_LOnEdB0v9SubNd4"
              alt="בקרת איכות ודיוק צבע"
              className="w-full h-[500px] md:h-[600px] object-cover asymmetric-clip-left opacity-90"
              loading="lazy"
            />
          </div>
          <div className="w-full lg:w-1/2 px-6 md:px-16 py-12 text-right reveal-item">
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              דיוק צבע שמתחיל במקצוענות
            </h2>
            <p className="font-sans text-white/80 text-lg md:text-xl leading-relaxed max-w-lg font-light mb-4">
              צבע הוא הרבה יותר מגוון. הוא חלק מהזהות של העסק שלכם.
            </p>
            <p className="font-sans text-white/70 text-base md:text-lg leading-relaxed max-w-lg">
              אנחנו מקפידים על בקרת צבע מתקדמת כדי שכל הדפסה תיראה בדיוק כפי שתוכננה, בין אם מדובר על דפוס דיגיטלי מהיר או הדפסות אופסט בהיקפים גדולים.
            </p>
          </div>
        </div>
      </section>

      {/* Inspiration Gallery */}
      <section id="gallery" className="py-24 md:py-32 bg-[#0d0e0f]">
        <div className="px-6 md:px-16 max-w-7xl mx-auto mb-16 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4">העבודות שלנו מדברות בעד עצמן</h2>
          <p className="font-sans text-white/70 text-lg md:text-xl font-light max-w-2xl mx-auto">
            מבחר עבודות שבוצעו עבור עסקים, ארגונים ולקוחות פרטיים מכל רחבי הארץ.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 md:px-16 max-w-7xl mx-auto">
          {galleryImages.map((image, index) => (
            <div key={index} className={`aspect-square overflow-hidden rounded-xl border border-white/5 reveal-item ${image.glowClass}`}>
              <img
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-zoom-in"
                src={image.url}
                alt={`גלריית השראה ${index + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section & Form */}
      <section id="contact" className="py-24 md:py-32 bg-gradient-to-b from-[#121414] to-[#0d0e0f] border-t border-white/5">
        <div className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Info details */}
            <div className="text-right lg:order-2">
              <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-6">בואו נדפיס משהו מיוחד.</h2>
              <p className="font-sans text-white/90 text-lg md:text-xl leading-relaxed mb-4 font-light">
                מחפשים בית דפוס שאפשר לסמוך עליו?
              </p>
              <p className="font-sans text-white/70 text-base md:text-lg leading-relaxed mb-8">
                נשמח להכיר את הפרויקט שלכם ולהציע את הפתרון המתאים ביותר.<br />
                <strong className="text-white font-semibold">ללא התחייבות. רק ייעוץ מקצועי ושירות אישי.</strong>
              </p>

              <div className="mt-8 border-t border-white/10 pt-8">
                <h3 className="font-display text-2xl font-bold text-white mb-6">יש לכם שאלה? דברו איתנו.</h3>
                <div className="flex flex-col gap-6 font-sans">
                  <div className="flex items-center gap-4 justify-end">
                    <div className="text-right">
                      <span className="text-white/40 text-xs block font-bold uppercase">טלפון</span>
                      <a href="tel:0543183186" className="text-white font-medium hover:text-[#00fbfb] transition-colors">0543183186</a>
                    </div>
                    <div className="p-3 bg-white/5 rounded-full text-[#ff2a85]">
                      <Phone size={24} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-end">
                    <div className="text-right">
                      <span className="text-white/40 text-xs block font-bold uppercase">וואטסאפ</span>
                      <a href="https://wa.me/972543183186?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%A2%D7%A9%D7%95%D7%AA%20%D7%A2%D7%91%D7%95%D7%93%D7%AA%20%D7%93%D7%A4%D7%95%D7%A1" target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-[#00fbfb] transition-colors">0543183186 (הודעה מהירה)</a>
                    </div>
                    <div className="p-3 bg-white/5 rounded-full text-[#00fbfb]">
                      <MessageSquare size={24} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-end">
                    <div className="text-right">
                      <span className="text-white/40 text-xs block font-bold uppercase">אימייל</span>
                      <a href="mailto:asishor2@gmail.com" className="text-white font-medium hover:text-[#ffe600] transition-colors">asishor2@gmail.com</a>
                    </div>
                    <div className="p-3 bg-white/5 rounded-full text-[#ffe600]">
                      <Mail size={24} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-end">
                    <div className="text-right">
                      <span className="text-white/40 text-xs block font-bold uppercase">כתובת</span>
                      <span className="text-white font-medium">אחד העם 3, תל אביב</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-full text-[#00fbfb]">
                      <MapPin size={24} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-end">
                    <div className="text-right">
                      <span className="text-white/40 text-xs block font-bold uppercase">שעות פעילות</span>
                      <span className="text-white font-medium">א׳-ה׳: 08:30 - 17:00</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-full text-[#ff2a85]">
                      <ChevronLeft size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Form */}
            <div className="glass-card p-8 md:p-12 rounded-3xl lg:order-1 text-right">
              <h3 className="font-display text-2xl font-bold text-white mb-6">בואו נדבר</h3>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6 font-sans">
                <div>
                  <label className="text-sm text-white/75 font-semibold block mb-2">שם מלא</label>
                  <input
                    type="text"
                    placeholder="שם מלא"
                    className="w-full bg-[#1e2020]/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00fbfb] focus:ring-1 focus:ring-[#00fbfb] transition-all text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/75 font-semibold block mb-2">מספר טלפון</label>
                  <input
                    type="tel"
                    placeholder="מספר טלפון"
                    className="w-full bg-[#1e2020]/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ff2a85] focus:ring-1 focus:ring-[#ff2a85] transition-all text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/75 font-semibold block mb-2">דואר אלקטרוני</label>
                  <input
                    type="email"
                    placeholder="דואר אלקטרוני"
                    className="w-full bg-[#1e2020]/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#ffe600] focus:ring-1 focus:ring-[#ffe600] transition-all text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/75 font-semibold block mb-2">פרטי ההודעה / פרויקט</label>
                  <textarea
                    rows={4}
                    placeholder="ספרו לנו קצת על הפרויקט..."
                    className="w-full bg-[#1e2020]/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00fbfb] focus:ring-1 focus:ring-[#00fbfb] transition-all text-white resize-none"
                  />
                </div>
                <div className="mt-4">
                  <BubbleButton type="submit" className="w-full">
                    שלחו בקשה
                  </BubbleButton>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full pt-24 pb-12 bg-[#08090a] border-t border-white/10" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-16 max-w-7xl mx-auto text-right">

          <div className="md:col-span-2">
            <div className="flex items-center mb-6 group cursor-pointer">
              <img src="/logo.png" alt="אסיגרף לוגו" className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            {/* <h3 className="font-display text-white text-2xl font-bold mb-3">אסיגרף</h3> */}
            <p className="font-sans text-white/80 leading-relaxed max-w-md mb-2 font-medium">
              בית דפוס משפחתי עם למעלה מ־40 שנות ניסיון.
            </p>
            <p className="font-sans text-white/70 leading-relaxed max-w-md mb-2 text-sm">
              פתרונות דפוס מתקדמים לעסקים, ארגונים ולקוחות פרטיים.
            </p>
            <p className="font-sans text-white/60 leading-relaxed max-w-md mb-8 text-sm">
              שירות אישי, איכות בלתי מתפשרת ומחויבות לכל עבודה.
            </p>
            <div className="flex gap-4 justify-start">
              <a href="#" className="p-3 bg-white/5 hover:bg-[#ffe600]/25 hover:text-[#ffe600] text-white rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,230,0,0.3)]">
                <QrCode size={20} />
              </a>
              <a href="#" className="p-3 bg-white/5 hover:bg-[#ff2a85]/25 hover:text-[#ff2a85] text-white rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,42,133,0.3)]">
                <Camera size={20} />
              </a>
              <a href="mailto:asishor2@gmail.com" className="p-3 bg-white/5 hover:bg-[#00fbfb]/25 hover:text-[#00fbfb] text-white rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,251,251,0.3)]">
                <AtSign size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-display text-white text-xl font-bold mb-4">קישורים מהירים</h4>
            <a className="font-sans text-white/60 hover-cmyk-cyan transition-colors" href="#">דף הבית</a>
            <a className="font-sans text-white/60 hover-cmyk-magenta transition-colors" href="#services">שירותים</a>
            <a className="font-sans text-white/60 hover-cmyk-yellow transition-colors" href="#projects">מוצרים</a>
            <a className="font-sans text-white/60 hover-cmyk-cyan transition-colors" href="#gallery">גלריית השראה</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-display text-white text-xl font-bold mb-4">פתרונות דפוס בתל אביב</h4>
            <span className="font-sans text-white/60 text-sm">דפוס דיגיטלי ודפוס אופסט</span>
            <span className="font-sans text-white/60 text-sm">הדפסות בהתאמה אישית לעסקים</span>
            <span className="font-sans text-white/60 text-sm">כרטיסי ביקור, קטלוגים, מדבקות</span>
            <span className="font-sans text-white/60 text-sm">אחד העם 3, תל אביב</span>
          </div>

        </div>

        <div className="mt-20 pt-8 border-t border-white/5 px-6 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <p className="font-sans text-white/40 text-sm">© {new Date().getFullYear()} אסיגרף - בית דפוס בתל אביב ובמרכז. כל הזכויות שמורות.</p>
          <div className="flex gap-8">
            <a className="font-sans text-white/40 text-xs hover:text-white transition-colors" href="#">מדיניות פרטיות</a>
            <a className="font-sans text-white/40 text-xs hover:text-white transition-colors" href="#">תנאי שימוש</a>
            <a className="font-sans text-white/40 text-xs hover:text-white transition-colors" href="#">הצהרת נגישות</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Contact Button */}
      <a
        href="https://wa.me/972543183186?text=%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%20%D7%9C%D7%A2%D7%A9%D7%95%D7%AA%20%D7%A2%D7%91%D7%95%D7%93%D7%AA%20%D7%93%D7%A4%D7%95%D7%A1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="צרו קשר בוואטסאפ"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full hover:scale-105 transition-all duration-300 group"
      >
        <span className="font-sans font-bold text-sm hidden sm:inline-block pl-1 text-white">
          דברו איתנו בוואטסאפ
        </span>
        <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
          <img src="/whatsapp.svg" alt="WhatsApp" className="w-full h-full object-contain" />
        </div>
      </a>

      {/* SVG Goo Filter for Bubble Buttons */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="goo">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

