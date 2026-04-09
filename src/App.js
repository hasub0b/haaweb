import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Menu, X } from 'lucide-react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwSAug8VPgY7gIt6psTuW-FzTCin-xyyUxVuHVbgerOVik8X1_x9_DL6EuxLAiPr8_V/exec';

const translations = {
  fi: {
    nav: {
      home: 'Etusivu',
      info: 'Info',
      rsvp: 'Ilmoittaudu',
    },
    home: {
      tagline: 'Liity kanssamme juhlimaan rakkauttamme',
      rsvpButton: 'ILMOITTAUDU',
      storyTitle: 'Jotain söpöä',
      storyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    info: {
      title: 'info',
      ceremony: 'Vihkiminen',
      ceremonyDate: 'Lauantai, 12.9.2026',
      ceremonyVenue: 'Viinikan kirkko, Tampere',
      reception: 'Juhlatila',
      receptionVenue: 'Komediateatteri, Tampere',
      dressCode: 'Pukukoodi',
      dressCodeValue: 'Tumma puku',
      dressCodeNote: 'jotain muuta?',
      other: 'Muuta',
      otherContent: 'muuta',
      otherNote: 'muuta',
      location: 'Sijainti',
    },
    rsvp: {
      title: 'RSVP',
      subtitle: 'Haluamme juhlia kanssanne! Vastatkaa 1.5.2026 mennessä.',
      successMessage: 'Kiitos! RSVP-vastauksenne on vastaanotettu.',
      errorMessage: 'Hups! Jotain meni pieleen. Yritä uudelleen tai ota meihin yhteyttä suoraan.',
      name: 'Koko nimi *',
      namePlaceholder: 'Nimesi',
      email: 'Sähköposti *',
      emailPlaceholder: 'sinun.sahkoposti@esimerkki.fi',
      attending: 'Osallistutteko? *',
      accept: 'Ilomielin hyväksymme',
      decline: 'Pahoitellen kieltäydymme',
      guests: 'Vieraiden lukumäärä *',
      guest1: '1 vieras',
      guest2: '2 vierasta',
      guest3: '3 vierasta',
      guest4: '4 vierasta',
      dietary: 'Ruokarajoitukset',
      vegetarian: 'Kasvisruokavalio',
      vegan: 'Vegaani',
      glutenFree: 'Gluteeniton',
      allergies: 'Allergiat tai muut ruokavaliotarpeet',
      allergiesPlaceholder: 'Kertokaa allergioistanne tai erityisistä ruokavaliotarpeistanne...',
      message: 'Viesti pariskunnalle',
      messagePlaceholder: 'Jättäkää onnittelunne tai kysymyksenne...',
      sending: 'Lähetetään...',
      submit: 'Lähetä RSVP',
    },
  },
  sv: {
    nav: {
      home: 'Hem',
      info: 'Info',
      rsvp: 'OSA',
    },
    home: {
      tagline: 'Följ med oss och fira vår kärlek',
      rsvpButton: 'OSA',
      storyTitle: 'Något gulligt',
      storyText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    info: {
      title: 'info',
      ceremony: 'Vigsel',
      ceremonyDate: 'Lördag, 12.9.2026',
      ceremonyVenue: 'Viinikan kyrka, Tammerfors',
      reception: 'Festlokal',
      receptionVenue: 'Komediateatteri, Tammerfors',
      dressCode: 'Klädkod',
      dressCodeValue: 'Mörk kostym',
      dressCodeNote: 'något annat?',
      other: 'Övrigt',
      otherContent: 'annat',
      otherNote: 'annat',
      location: 'Plats',
    },
    rsvp: {
      title: 'OSA',
      subtitle: 'Vi vill gärna fira med er! Vänligen svara senast 1.5.2026.',
      successMessage: 'Tack! Ditt OSA har mottagits.',
      errorMessage: 'Hoppsan! Något gick fel. Försök igen eller kontakta oss direkt.',
      name: 'Fullständigt namn *',
      namePlaceholder: 'Ditt namn',
      email: 'E-post *',
      emailPlaceholder: 'din.epost@exempel.se',
      attending: 'Kommer ni att delta? *',
      accept: 'Tackar ja med glädje',
      decline: 'Tackar tyvärr nej',
      guests: 'Antal gäster *',
      guest1: '1 gäst',
      guest2: '2 gäster',
      guest3: '3 gäster',
      guest4: '4 gäster',
      dietary: 'Kostbegränsningar',
      vegetarian: 'Vegetarisk',
      vegan: 'Vegan',
      glutenFree: 'Glutenfri',
      allergies: 'Allergier eller andra kostbehov',
      allergiesPlaceholder: 'Meddela oss om allergier eller specifika kostbehov...',
      message: 'Meddelande till brudparet',
      messagePlaceholder: 'Dela dina lyckönskningar eller ställ dina frågor...',
      sending: 'Skickar...',
      submit: 'Skicka OSA',
    },
  },
};

const HomePage = ({ setCurrentPage, t }) => (
  <div className="page-content home-page">
    <div className="hero-section">
      <div className="ornament top-ornament">
        <div className="ornament-line"></div>
        <Heart className="ornament-heart" size={28} />
        <div className="ornament-line"></div>
      </div>

      <h1 className="names">
        <span className="name-first">Riikka</span>
        <span className="ampersand">&</span>
        <span className="name-second">Aleksi</span>
      </h1>

      <div className="wedding-details">
        <div className="detail-item">
          <Calendar size={20} />
          <span>12.9.2026</span>
        </div>
        <div className="detail-item">
          <MapPin size={20} />
          <span>Tampere</span>
        </div>
      </div>

      <div className="ornament bottom-ornament">
        <div className="ornament-line"></div>
        <Heart className="ornament-heart" size={28} />
        <div className="ornament-line"></div>
      </div>

      <p className="tagline">{t.home.tagline}</p>

      <button
        className="cta-button"
        onClick={() => setCurrentPage('rsvp')}
      >
        {t.home.rsvpButton}
      </button>
    </div>

    <div className="story-section">
      <h2>{t.home.storyTitle}</h2>
      <p>{t.home.storyText}</p>
    </div>
  </div>
);

const InfoPage = ({ t }) => (
  <div className="page-content info-page">
    <h1 className="page-title">{t.info.title}</h1>

    <div className="info-grid">
      <div className="info-card">
        <h2>{t.info.ceremony}</h2>
        <div className="info-details">
          <div className="detail-row">
            <Calendar size={18} />
            <span>{t.info.ceremonyDate}</span>
          </div>
          <div className="detail-row">
            <span className="time">13:00</span>
          </div>
          <div className="detail-row">
            <MapPin size={18} />
            <span>{t.info.ceremonyVenue}</span>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h2>{t.info.reception}</h2>
        <div className="info-details">
          <div className="detail-row">
            <span className="time">14:00 - 23:00</span>
          </div>
          <div className="detail-row">
            <MapPin size={18} />
            <span>{t.info.receptionVenue}</span>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h2>{t.info.dressCode}</h2>
        <div className="info-details">
          <p>{t.info.dressCodeValue}</p>
          <p className="dress-note">{t.info.dressCodeNote}</p>
        </div>
      </div>

      <div className="info-card">
        <h2>{t.info.other}</h2>
        <div className="info-details">
          <p>{t.info.otherContent}</p>
          <p className="small-text">{t.info.otherNote}</p>
        </div>
      </div>
    </div>

    <div className="map-section">
      <h2>{t.info.location}</h2>
      <div className="map-container">
        <iframe
          title="Häävenue kartta"
          src="https://www.google.com/maps/d/u/0/embed?mid=1ruDgFmcpzbQzbH_N1-MkOm_5MZPKsRo&ehbc=2E312F&noprof=1"
          width="100%"
          height="480"
          style={{ border: 0, borderRadius: '8px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </div>
);

const RSVPPage = ({ formData, setFormData, submitStatus, setSubmitStatus, t }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        attending: '',
        guests: '1',
        dietary: '',
        allergies: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDietaryChange = (e) => {
    const value = e.target.value;
    const current = formData.dietary.split(',').filter(Boolean);
    if (e.target.checked) {
      current.push(value);
    } else {
      const index = current.indexOf(value);
      if (index > -1) current.splice(index, 1);
    }
    setFormData(prev => ({ ...prev, dietary: current.join(',') }));
  };

  return (
    <div className="page-content rsvp-page">
      <h1 className="page-title">{t.rsvp.title}</h1>
      <p className="rsvp-subtitle">{t.rsvp.subtitle}</p>

      {submitStatus === 'success' && (
        <div className="success-message">
          <Heart size={24} />
          <p>{t.rsvp.successMessage}</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="error-message">
          <p>{t.rsvp.errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rsvp-form">
        <div className="form-group">
          <label htmlFor="name">{t.rsvp.name}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder={t.rsvp.namePlaceholder}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">{t.rsvp.email}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder={t.rsvp.emailPlaceholder}
          />
        </div>

        <div className="form-group">
          <label>{t.rsvp.attending}</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={formData.attending === 'yes'}
                onChange={handleInputChange}
                required
              />
              <span>{t.rsvp.accept}</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="attending"
                value="no"
                checked={formData.attending === 'no'}
                onChange={handleInputChange}
                required
              />
              <span>{t.rsvp.decline}</span>
            </label>
          </div>
        </div>

        {formData.attending === 'yes' && (
          <>
            <div className="form-group">
              <label htmlFor="guests">{t.rsvp.guests}</label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                required
              >
                <option value="1">{t.rsvp.guest1}</option>
                <option value="2">{t.rsvp.guest2}</option>
                <option value="3">{t.rsvp.guest3}</option>
                <option value="4">{t.rsvp.guest4}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t.rsvp.dietary}</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" value="vegetarian" onChange={handleDietaryChange} />
                  <span>{t.rsvp.vegetarian}</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="vegan" onChange={handleDietaryChange} />
                  <span>{t.rsvp.vegan}</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="gluten-free" onChange={handleDietaryChange} />
                  <span>{t.rsvp.glutenFree}</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="allergies">{t.rsvp.allergies}</label>
              <textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                rows="3"
                placeholder={t.rsvp.allergiesPlaceholder}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="message">{t.rsvp.message}</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            placeholder={t.rsvp.messagePlaceholder}
          />
        </div>

        <button type="submit" className="submit-button" disabled={submitStatus === 'sending'}>
          {submitStatus === 'sending' ? t.rsvp.sending : t.rsvp.submit}
        </button>
      </form>
    </div>
  );
};

export default function WeddingWebsite() {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('fi');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: '',
    guests: '1',
    dietary: '',
    allergies: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const t = translations[lang];

  return (
    <div className="wedding-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #2c5f5d;
          --primary-light: #4a8886;
          --accent: #d4a574;
          --accent-light: #e8c9a8;
          --text-dark: #2c2c2c;
          --text-light: #666;
          --bg-cream: #faf8f5;
          --bg-white: #ffffff;
          --border-color: #e5e0d8;
        }

        body {
          font-family: 'Montserrat', sans-serif;
          color: var(--text-dark);
          background: var(--bg-cream);
          line-height: 1.6;
        }

        .wedding-app {
          min-height: 100vh;
        }

        /* Navigation */
        nav {
          border-bottom: 2px solid #d4b84a;
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: #fffaed;
          background-image:
            url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g transform='translate(100,100)' opacity='0.35'><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(30)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(60)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(90)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(120)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(150)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(180)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(210)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(240)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(270)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(300)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(330)'/><circle r='16' fill='%236b3a1f'/><circle r='11' fill='%234a2810'/></g></svg>"),
            url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><g transform='translate(100,100)' opacity='0.35'><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(30)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(60)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(90)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(120)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(150)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(180)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(210)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(240)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(270)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(300)'/><ellipse cx='0' cy='-28' rx='7' ry='14' fill='%23f5c518' transform='rotate(330)'/><circle r='16' fill='%236b3a1f'/><circle r='11' fill='%234a2810'/></g></svg>");
          background-size: 160px 160px, 160px 160px;
          background-position: 0 0, 80px 80px;
          background-repeat: repeat, repeat;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary);
          letter-spacing: 2px;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }

        .nav-links button {
          background: none;
          border: none;
          color: var(--text-dark);
          text-decoration: none;
          font-size: 0.95rem;
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: color 0.3s ease;
          cursor: pointer;
          padding: 0;
        }

        .nav-links button:hover,
        .nav-links button.active {
          color: var(--primary);
        }

        .lang-switcher {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .lang-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: var(--text-light);
          padding: 0.25rem 0.4rem;
          border-radius: 2px;
          transition: color 0.2s ease;
        }

        .lang-btn:hover {
          color: var(--primary);
        }

        .lang-btn.active {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .lang-divider {
          color: var(--border-color);
          font-size: 0.85rem;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 2rem;
          justify-content: flex-end;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: #fffaed;
            padding: 2rem;
            gap: 1.5rem;
            border-bottom: 2px solid #d4b84a;
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
          }

          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }
        }

        /* Page Content */
        .page-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Home Page */
        .home-page {
          text-align: center;
          max-width: 900px;
        }

        .hero-section {
          padding: 3rem 0;
        }

        .ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin: 2rem 0;
          opacity: 0;
          animation: fadeInUp 1s ease forwards;
        }

        .top-ornament {
          animation-delay: 0.2s;
        }

        .bottom-ornament {
          animation-delay: 0.6s;
        }

        .ornament-line {
          width: 60px;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--accent), transparent);
        }

        .ornament-heart {
          color: var(--accent);
          animation: heartbeat 2s ease infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .names {
          font-family: 'Cormorant Garamond', serif;
          font-size: 4.5rem;
          font-weight: 300;
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          opacity: 0;
          animation: fadeInUp 1s ease 0.3s forwards;
        }

        .name-first,
        .name-second {
          color: var(--primary);
          letter-spacing: 4px;
        }

        .ampersand {
          font-size: 2.5rem;
          color: var(--accent);
          font-style: italic;
        }

        .wedding-details {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 2rem 0;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeInUp 1s ease 0.5s forwards;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-light);
          font-size: 1.1rem;
        }

        .detail-item svg {
          color: var(--accent);
        }

        .tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: var(--text-light);
          font-style: italic;
          margin: 2rem 0;
          opacity: 0;
          animation: fadeInUp 1s ease 0.7s forwards;
        }

        .cta-button {
          background: var(--primary);
          color: white;
          border: none;
          padding: 1rem 3rem;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 2px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 2rem;
          opacity: 0;
          animation: fadeInUp 1s ease 0.8s forwards;
        }

        .cta-button:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(44, 95, 93, 0.3);
        }

        .story-section {
          margin-top: 5rem;
          padding: 3rem;
          background: var(--bg-white);
          border-radius: 4px;
          border: 1px solid var(--border-color);
          opacity: 0;
          animation: fadeInUp 1s ease 1s forwards;
        }

        .story-section h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          color: var(--primary);
          margin-bottom: 1.5rem;
          font-weight: 400;
        }

        .story-section p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-light);
        }

        /* Info Page */
        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem;
          color: var(--primary);
          text-align: center;
          margin-bottom: 3rem;
          font-weight: 400;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .info-card {
          background: var(--bg-white);
          padding: 2rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .info-card h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          color: var(--primary);
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .info-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-dark);
        }

        .detail-row svg {
          color: var(--accent);
          flex-shrink: 0;
        }

        .time {
          font-weight: 600;
          color: var(--primary);
        }

        .dress-note,
        .small-text {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .map-section {
          margin-top: 4rem;
        }

        .map-section h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.5rem;
          color: var(--primary);
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 400;
        }

        .map-container {
          background: var(--bg-white);
          padding: 1.5rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }

        .map-note {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: var(--text-light);
          text-align: center;
          font-style: italic;
        }

        /* RSVP Page */
        .rsvp-page {
          max-width: 700px;
        }

        .rsvp-subtitle {
          text-align: center;
          color: var(--text-light);
          margin-bottom: 3rem;
          font-size: 1.1rem;
        }

        .rsvp-form {
          background: var(--bg-white);
          padding: 3rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }

        .form-group {
          margin-bottom: 2rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-dark);
          font-size: 0.95rem;
        }

        input[type="text"],
        input[type="email"],
        select,
        textarea {
          width: 100%;
          padding: 0.875rem;
          border: 1px solid var(--border-color);
          border-radius: 2px;
          font-size: 1rem;
          font-family: 'Montserrat', sans-serif;
          transition: border-color 0.3s ease;
          background: var(--bg-cream);
        }

        input[type="text"]:focus,
        input[type="email"]:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: var(--primary);
          background: white;
        }

        .radio-group,
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .radio-label,
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-weight: 400;
          color: var(--text-dark);
        }

        input[type="radio"],
        input[type="checkbox"] {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
          accent-color: var(--primary);
        }

        .submit-button {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          padding: 1.125rem;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(44, 95, 93, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success-message,
        .error-message {
          padding: 1.5rem;
          border-radius: 4px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .success-message {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #81c784;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          border: 1px solid #ef5350;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .names {
            font-size: 3rem;
          }

          .page-content {
            padding: 2rem 1.5rem;
          }

          .rsvp-form {
            padding: 2rem 1.5rem;
          }

          .wedding-details {
            gap: 1.5rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .lang-switcher {
            order: -1;
          }
        }
      `}</style>

      <nav>
        <div className="nav-container">
          <div className="logo">R & A</div>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li>
              <button
                className={currentPage === 'home' ? 'active' : ''}
                onClick={() => { setCurrentPage('home'); setMenuOpen(false); }}
              >
                {t.nav.home}
              </button>
            </li>
            <li>
              <button
                className={currentPage === 'info' ? 'active' : ''}
                onClick={() => { setCurrentPage('info'); setMenuOpen(false); }}
              >
                {t.nav.info}
              </button>
            </li>
            <li>
              <button
                className={currentPage === 'rsvp' ? 'active' : ''}
                onClick={() => { setCurrentPage('rsvp'); setMenuOpen(false); }}
              >
                {t.nav.rsvp}
              </button>
            </li>
          </ul>
          <div className="nav-right">
            <div className="lang-switcher">
              <button
                className={`lang-btn ${lang === 'fi' ? 'active' : ''}`}
                onClick={() => setLang('fi')}
              >
                FI
              </button>
              <span className="lang-divider">|</span>
              <button
                className={`lang-btn ${lang === 'sv' ? 'active' : ''}`}
                onClick={() => setLang('sv')}
              >
                SV
              </button>
            </div>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} t={t} />}
      {currentPage === 'info' && <InfoPage t={t} />}
      {currentPage === 'rsvp' && <RSVPPage formData={formData} setFormData={setFormData} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} t={t} />}
    </div>
  );
}
