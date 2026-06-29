export default function PrivacyPage() {
  return (
    <article className="prose prose-slate dark:prose-invert mx-auto max-w-3xl pt-32 pb-24">
      <h1>Política de privacidad</h1>
      <p>
        Venezuela Solidaria respeta tu privacidad y cumple con el Reglamento General de Protección de Datos (RGPD)
        y la legislación venezolana aplicable. Esta política describe qué datos recopilamos, cómo los usamos
        y cuáles son tus derechos.
      </p>
      <h2>1. Datos que recopilamos</h2>
      <ul>
        <li>Datos de identificación (nombre, email, teléfono) al registrarte o donar.</li>
        <li>Datos de pago (procesados por Stripe; no almacenamos tarjetas).</li>
        <li>Datos de navegación (cookies, IP) para mejorar el servicio.</li>
      </ul>
      <h2>2. Uso de los datos</h2>
      <p>
        Utilizamos tus datos para: procesar donaciones, emitir recibos fiscales, coordinar entregas,
        enviarte comunicaciones que has autorizado y cumplir obligaciones legales.
      </p>
      <h2>3. Cifrado y seguridad</h2>
      <p>
        Todos los datos sensibles se cifran con AES-256-GCM. Las comunicaciones usan TLS 1.3.
        Realizamos auditorías de seguridad periódicas.
      </p>
      <h2>4. Tus derechos</h2>
      <p>
        Puedes acceder, rectificar, suprimir, limitar el tratamiento, portar tus datos y oponerte al mismo.
        Escríbenos a <a href="mailto:privacidad@venezuelasolidaria.org">privacidad@venezuelasolidaria.org</a>.
      </p>
      <h2>5. Base legal</h2>
      <p>
        El tratamiento se basa en tu consentimiento, la ejecución de donaciones y el cumplimiento de obligaciones legales.
      </p>
    </article>
  );
}
