import React, { useState, useRef } from 'react';
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
      tagline: 'Tervetuloa häihimme!',
      rsvpButton: 'Ilmoittaudu',
    },
    info: {
      title: 'Info',
      ceremony: 'Vihkiminen',
      ceremonyDate: 'Lauantai, 12.9.2026',
      ceremonyVenue: 'Viinikan kirkko, Tampere',
      ceremonyAddress: 'Kadunnimi 1, 33XXX Tampere',
      reception: 'Juhla',
      receptionVenue: 'Komediateatteri, Tampere',
      receptionAddress: 'Kadunnimi 1, 33XXX Tampere',
      receptionTime: 'alkaen 14:00',
      dressCode: 'Pukukoodi',
      dressCodeValue: 'Juhlallinen',
      dressCodeNote: 'jotain muuta?',
      other: 'Muuta',
      otherContent: 'muuta',
      otherNote: 'muuta',
      gift: 'Häälahjat',
      giftText: 'Häälahjaksi toivomme taloudellista tukea häämatkallemme. Voitte lähettää haluamanne summan pankkitilille:',
      giftAccount: 'IBAN: [tba]',
      giftName: 'nimi',
      location: 'Sijainti',
    },
    rsvp: {
      title: 'Ilmoittautuminen',
      subtitle: 'Haluamme juhlia kanssanne! Ilmoittautukaa 1.5.2026 mennessä.',
      successMessage: 'Kiitos! Ilmoittautumisenne on vastaanotettu.',
      errorMessage: 'Hups! Jotain meni pieleen. Yritä uudelleen tai ota meihin yhteyttä suoraan.',
      attending: 'Osallistutteko?',
      accept: 'Joo',
      decline: 'Ei',
      declineName: 'Nimesi *',
      decliningNamePlaceholder: 'Etunimi Sukunimi',
      guestCount: 'Vieraiden lukumäärä',
      guestLabel: 'Vieras',
      guestName: 'Nimi *',
      guestNamePlaceholder: 'Vieraan nimi',
      dietary: 'Ruokarajoitukset',
      vegetarian: 'Kasvisruokavalio',
      vegan: 'Vegaani',
      glutenFree: 'Gluteeniton',
      allergies: 'Muut allergiat tai ruokavaliotarpeet',
      allergiesPlaceholder: 'Kerro allergioista tai erityisistä ruokavaliotarpeista...',
      speech: 'Haluatteko pitää puheen tai muun esityksen?',
      speechNote: 'Kerrottehan viestikentässä lyhyesti aiheesta, niin osaamme järjestää teille ajan ohjelmassa.',
      message: 'Viesti pariskunnalle',
      messagePlaceholder: 'Jättäkää onnittelunne, kysymyksenne tai lisätietoja puheesta...',
      sending: 'Lähetetään...',
      submit: 'Lähetä ilmoittautuminen',
    },
  },
  sv: {
    nav: {
      home: 'Hem',
      info: 'Info',
      rsvp: 'Anmälan',
    },
    home: {
      tagline: 'Välkommen till vårt bröllop!',
      rsvpButton: 'Anmälan',
    },
    info: {
      title: 'Info',
      ceremony: 'Vigsel',
      ceremonyDate: 'Lördag, 12.9.2026',
      ceremonyVenue: 'Viinikan kyrka, Tammerfors',
      ceremonyAddress: 'Gatunamn 1, 33XXX Tammerfors',
      reception: 'Fest',
      receptionVenue: 'Komediateatteri, Tammerfors',
      receptionAddress: 'Gatunamn 1, 33XXX Tammerfors',
      receptionTime: 'från 14:00',
      dressCode: 'Klädkod',
      dressCodeValue: 'Festlig',
      dressCodeNote: 'något annat?',
      other: 'Övrigt',
      otherContent: 'annat',
      otherNote: 'annat',
      gift: 'Bröllopsgåva',
      giftText: 'Som bröllopsgåva önskar vi ekonomiskt stöd till vår smekmånadsresa. Ni är välkomna att skicka valfri summa till bankgirot:',
      giftAccount: 'IBAN: [tba]',
      giftName: 'nimi',
      location: 'Plats',
    },
    rsvp: {
      title: 'Anmälan',
      subtitle: 'Vi vill gärna fira med er! Vänligen anmäl er senast 1.5.2026.',
      successMessage: 'Tack! Er anmälan har mottagits.',
      errorMessage: 'Hoppsan! Något gick fel. Försök igen eller kontakta oss direkt.',
      attending: 'Kommer ni att delta?',
      accept: 'Ja',
      decline: 'Nej',
      declineName: 'Ditt namn *',
      decliningNamePlaceholder: 'Förnamn Efternamn',
      guestCount: 'Antal gäster',
      guestLabel: 'Gäst',
      guestName: 'Namn *',
      guestNamePlaceholder: 'Gästens namn',
      dietary: 'Kostbegränsningar',
      vegetarian: 'Vegetarisk',
      vegan: 'Vegan',
      glutenFree: 'Glutenfri',
      allergies: 'Övriga allergier eller kostbehov',
      allergiesPlaceholder: 'Berätta om allergier eller specifika kostbehov...',
      speech: 'Vill ni hålla tal eller annat framträdande?',
      speechNote: 'Berätta kort om det i meddelandefältet så vi kan ge er tid i programmet.',
      message: 'Meddelande till brudparet',
      messagePlaceholder: 'Dela dina lyckönskningar, frågor eller info om tal...',
      sending: 'Skickar...',
      submit: 'Skicka anmälan',
    },
  },
};

const PASSCODE = '1209';

const LockScreen = ({ onUnlock }) => {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const refs = [ref0, ref1, ref2, ref3];

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(false);

    if (value && index < 3) refs[index + 1].current.focus();

    const code = newDigits.join('');
    if (code.length === 4) {
      if (code === PASSCODE) {
        localStorage.setItem('wedding_auth', 'true');
        onUnlock();
      } else {
        setError(true);
        const cleared = ['', '', '', ''];
        setDigits(cleared);
        refs[0].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#faf8f5',
      backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`,
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto 30%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');
        .pin-input {
          width: 64px; height: 72px;
          font-size: 2rem; font-weight: 600;
          text-align: center;
          border: 1px solid #e5e0d8;
          border-radius: 4px;
          background: rgba(255,255,255,0.85);
          color: #2c2c2c;
          outline: none;
          font-family: 'Montserrat', sans-serif;
          transition: border-color 0.2s;
          -webkit-text-security: disc;
        }
        .pin-input:focus { border-color: #2c5f5d; background: #fff; }
        .pin-input.pin-error { border-color: #c62828; animation: shake 0.3s ease; }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>

      <div style={{ textAlign: 'center', padding: '2.5rem 2rem', background: 'rgba(250,248,245,0.92)', borderRadius: '6px', border: '1px solid #e5e0d8', maxWidth: '360px', width: '90%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '40px', height: '1px', background: '#d4a574' }} />
          <Heart size={20} color="#d4a574" />
          <div style={{ width: '40px', height: '1px', background: '#d4a574' }} />
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', fontWeight: 300, color: '#2c5f5d', letterSpacing: '3px', marginBottom: '0.25rem' }}>
          Riikka & Aleksi
        </h1>
        <p style={{ color: '#888', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '2rem' }}>12.9.2026</p>

        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Syötä salasana / Ange lösenord</p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1rem' }}>
          {refs.map((ref, i) => (
            <input
              key={i}
              ref={ref}
              className={`pin-input${error ? ' pin-error' : ''}`}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digits[i]}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && (
          <p style={{ color: '#c62828', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Väärä koodi / Fel kod
          </p>
        )}
      </div>
    </div>
  );
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

    <div className="photo-section">
      {/* Photos coming soon */}
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
            <span className="time">13:00</span>
          </div>
          <div className="detail-row">
            <Calendar size={18} />
            <span>{t.info.ceremonyDate}</span>
          </div>
          <div className="detail-row">
            <MapPin size={18} />
            <div>
              <span>{t.info.ceremonyVenue}</span>
              <span className="address">{t.info.ceremonyAddress}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="info-card">
        <h2>{t.info.reception}</h2>
        <div className="info-details">
          <div className="detail-row">
            <span className="time">{t.info.receptionTime}</span>
          </div>
          <div className="detail-row">
            <Calendar size={18} />
            <span>{t.info.ceremonyDate}</span>
          </div>
          <div className="detail-row">
            <MapPin size={18} />
            <div>
              <span>{t.info.receptionVenue}</span>
              <span className="address">{t.info.receptionAddress}</span>
            </div>
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
        <h2>{t.info.gift}</h2>
        <div className="info-details">
          <p>{t.info.giftText}</p>
          <p className="gift-account">{t.info.giftAccount}</p>
          <p className="small-text">{t.info.giftName}</p>
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

const emptyGuest = () => ({ name: '', dietary: '', allergies: '' });

const RSVPPage = ({ formData, setFormData, submitStatus, setSubmitStatus, t }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, timestamp: new Date().toISOString() })
      });
      setSubmitStatus('success');
      setFormData({ name: '', attending: '', guestCount: 1, guests: [emptyGuest()], speech: false, message: '' });
    } catch (err) {
      setSubmitStatus('error');
      console.error('Error:', err);
    }
  };

  const handleGuestCountChange = (e) => {
    const count = parseInt(e.target.value);
    const current = formData.guests;
    const newGuests = count > current.length
      ? [...current, ...Array(count - current.length).fill(null).map(emptyGuest)]
      : current.slice(0, count);
    setFormData(prev => ({ ...prev, guestCount: count, guests: newGuests }));
  };

  const updateGuest = (index, field, value) => {
    const newGuests = formData.guests.map((g, i) => i === index ? { ...g, [field]: value } : g);
    setFormData(prev => ({ ...prev, guests: newGuests }));
  };

  const updateGuestDietary = (guestIndex, value, checked) => {
    const current = formData.guests[guestIndex].dietary.split(',').filter(Boolean);
    if (checked) current.push(value);
    else current.splice(current.indexOf(value), 1);
    updateGuest(guestIndex, 'dietary', current.join(','));
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

        {/* Attending */}
        <div className="form-group">
          <label>{t.rsvp.attending}</label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="attending" value="yes"
                checked={formData.attending === 'yes'}
                onChange={e => setFormData(prev => ({ ...prev, attending: e.target.value }))}
                required />
              <span>{t.rsvp.accept}</span>
            </label>
            <label className="radio-label">
              <input type="radio" name="attending" value="no"
                checked={formData.attending === 'no'}
                onChange={e => setFormData(prev => ({ ...prev, attending: e.target.value }))}
                required />
              <span>{t.rsvp.decline}</span>
            </label>
          </div>
        </div>

        {formData.attending === 'no' && (
          <div className="form-group">
            <label>{t.rsvp.declineName}</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t.rsvp.decliningNamePlaceholder}
              required
            />
          </div>
        )}

        {formData.attending === 'yes' && (
          <>
            {/* Guest count */}
            <div className="form-group">
              <label htmlFor="guestCount">{t.rsvp.guestCount}</label>
              <select id="guestCount" value={formData.guestCount} onChange={handleGuestCountChange}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Per-guest fields */}
            {formData.guests.map((guest, i) => (
              <div key={i} className="guest-section">
                <h3 className="guest-heading">{t.rsvp.guestLabel} {i + 1}</h3>

                <div className="form-group">
                  <label>{t.rsvp.guestName}</label>
                  <input
                    type="text"
                    value={guest.name}
                    onChange={e => updateGuest(i, 'name', e.target.value)}
                    placeholder={t.rsvp.guestNamePlaceholder}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t.rsvp.dietary}</label>
                  <div className="checkbox-group">
                    {[
                      { value: 'vegetarian', label: t.rsvp.vegetarian },
                      { value: 'vegan', label: t.rsvp.vegan },
                      { value: 'gluten-free', label: t.rsvp.glutenFree },
                    ].map(opt => (
                      <label key={opt.value} className="checkbox-label">
                        <input type="checkbox" value={opt.value}
                          checked={guest.dietary.split(',').includes(opt.value)}
                          onChange={e => updateGuestDietary(i, opt.value, e.target.checked)} />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.rsvp.allergies}</label>
                  <textarea
                    value={guest.allergies}
                    onChange={e => updateGuest(i, 'allergies', e.target.value)}
                    rows="2"
                    placeholder={t.rsvp.allergiesPlaceholder}
                  />
                </div>
              </div>
            ))}

            {/* Speech */}
            <div className="form-group">
              <label className="checkbox-label speech-checkbox">
                <input type="checkbox"
                  checked={formData.speech}
                  onChange={e => setFormData(prev => ({ ...prev, speech: e.target.checked }))} />
                <span>{t.rsvp.speech}</span>
              </label>
              {formData.speech && (
                <p className="speech-note">{t.rsvp.speechNote}</p>
              )}
            </div>
          </>
        )}

        {/* Message */}
        <div className="form-group">
          <label htmlFor="message">{t.rsvp.message}</label>
          <textarea
            id="message"
            value={formData.message}
            onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
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
  const [locked, setLocked] = useState(() => localStorage.getItem('wedding_auth') !== 'true');
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('fi');
  const [formData, setFormData] = useState({
    name: '',
    attending: '',
    guestCount: 1,
    guests: [emptyGuest()],
    speech: false,
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const t = translations[lang];

  if (locked) return <LockScreen onUnlock={() => setLocked(false)} />;

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
          border-bottom: 1px solid var(--primary);
          position: sticky;
          top: 0;
          z-index: 100;
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
          .nav-container {
            display: flex;
            justify-content: space-between;
          }

          .menu-toggle {
            display: block;
          }

          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background-image: url('${process.env.PUBLIC_URL}/background.png');
            background-repeat: repeat;
            background-size: auto;
            padding: 2rem;
            gap: 1.5rem;
            border-bottom: 2px solid var(--primary);
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
          grid-template-columns: repeat(2, 1fr);
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

        .address {
          display: block;
          font-size: 0.85rem;
          color: var(--text-light);
          margin-top: 0.2rem;
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

        .photo-section {
          margin-top: 4rem;
          min-height: 200px;
        }

        .guest-section {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          background: var(--bg-cream);
        }

        .guest-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 1.25rem;
        }

        .speech-checkbox {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .speech-note {
          font-size: 0.88rem;
          color: var(--primary);
          background: var(--accent-light);
          border-left: 3px solid var(--accent);
          padding: 0.6rem 0.9rem;
          border-radius: 2px;
          margin-top: 0.5rem;
          line-height: 1.5;
        }

        .gift-account {
          font-weight: 600;
          color: var(--primary);
          font-size: 0.95rem;
          margin-top: 0.5rem;
          letter-spacing: 0.5px;
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

      <nav style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/background.png)`, backgroundRepeat: 'repeat', backgroundSize: 'auto 400%', backgroundPosition: '0 -132px', backgroundColor: '#faf8f5' }}>
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
