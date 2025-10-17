// JavaScript for animations and interactive elements

const translations = {
    tr: {
        page_title: "mrCetin Tech - Mobil Uygulama ve Oyun Tasarımı",
        nav_applications: "Uygulamalarımız",
        nav_about_us: "Biz Kimiz",
        nav_vision: "Vizyon",
        nav_mission: "Misyon",
        nav_contact: "İletişim",
        hero_title: "Yenilikçi Mobil Uygulama ve Oyun Deneyimleri",
        hero_subtitle: "Hayallerinizi dijital dünyaya taşıyoruz.",
        hero_button: "Projelerimizi Keşfedin",
        applications_title: "Uygulamalarımız",
        applications_text: "Burada mobil uygulama ve oyun projelerimizden örnekler yer alacak.",
        game_project_1_title: "Oyun Projesi 1",
        game_project_1_description: "Heyecan verici bir mesleki eğitim oyunu. Geliştirme aşamasında.",
        game_project_2_title: "Oyun Projesi 2",
        game_project_2_description: "Nostaljik bir mücadele deneyimi. Geliştirme aşamasında.",
        mobile_app_project_title: "Mobil Uygulama Projesi",
        mobile_app_project_description: "Gezi deneyimizi geliştirecek ve rotanız için eksikliklerinizi tamamlayacak bir uygulama. Yakında kullanıma sunulacaktır.",
        status_in_development: "Geliştirme Aşamasında",
        status_coming_soon: "Yakında Kullanıma Sunulacaktır",
        about_us_title: "Biz Kimiz",
        about_us_text_p1: "Mobil uygulama ve dijital ürün geliştirme süreçlerinde; yüksek teknik doğruluk, güvenlik ve sürdürülebilirlik ilkeleriyle hareket eden bir teknoloji ve iletişim stüdyosuyuz.",
        about_us_text_p2: "Karmaşık altyapıları sadeleştiren, süreçleri otomasyonla optimize eden ve her adımı belgelenmiş biçimde sunan bir yaklaşım benimsiyoruz.",
        about_us_text_p3: "Uygulama mimarisi, veri güvenliği, kullanıcı deneyimi ve iletişim altyapısı gibi kritik bileşenlerde; hem mühendislik hem de strateji odaklı çözümler geliştiriyoruz.",
        about_us_text_p4: "Her proje, sadece işlevsel değil; aynı zamanda kurumsal kimliğe entegre, uzun vadeli başarıya uygun ve teknik olarak sürdürülebilir olacak şekilde tasarlanır.",
        about_us_text_p5: "Markaların dijital dünyada güçlü bir iz bırakabilmesi için; teknik altyapılarını profesyonelce yapılandırıyor, iletişim dillerini stratejik biçimde şekillendiriyoruz.",
        about_us_text_p6: "Çünkü biz, dijital ürünlerin yalnızca geliştiricisi değil; onları geleceğe taşıyan, rehberlik eden ve değer üreten bir çözüm ortağıyız.",
        vision_title: "Vizyon",
        vision_text: "Bilgi güvenliği, sistem sürdürülebilirliği ve dijital iletişimde mükemmeliyet ilkesiyle; kurumların teknik altyapılarını sade, güvenli ve ölçeklenebilir biçimde inşa ederek dijital dünyada iz bırakan bir referans noktası olmak. Yüksek doğrulukla yapılandırılmış sistemler ve stratejik iletişim çözümleriyle; teknolojiye yön veren, rehberlik eden ve değer üreten bir ekosistem oluşturmayı hedefliyoruz.",
        mission_title: "Misyon",
        mission_text: "Karmaşık teknolojik süreçleri sadeleştirerek; e-posta güvenliği, zincirli sertifika entegrasyonu, otomasyon ve marka iletişimi alanlarında bütüncül çözümler sunmak. Her projede teknik doğruluk, sürdürülebilirlik ve kullanıcı odaklılık ilkeleriyle hareket ederek; kurumların dijital varlıklarını güvenli, profesyonel ve etkili biçimde konumlandırmalarını sağlıyoruz.",
        contact_title: "İletişim",
        contact_text: "Bize ulaşın ve projenizi konuşalım.",
        contact_address: "Çekmeköy, İstanbul, Türkiye",
        contact_phone: "Telefon: +90531-932 33 96",
        contact_email: "E-posta: admin@mrcetin.com",
        footer_privacy: "Gizlilik Politikası",
        footer_cookies: "Çerezlerin Kullanımı",
        footer_terms: "Kullanım Şartları",
        footer_legal: "Yasal",
        footer_sitemap: "Site Haritası",
        footer_copyright: "© 2025 mrCetin Tech. Tüm Hakları Saklıdır.",
        privacy_policy_title: "Gizlilik Politikası",
        privacy_policy_text: "Bu gizlilik politikası, mrCetin Tech'in kişisel verilerinizi nasıl topladığını, kullandığını, ifşa ettiğini ve koruduğunu açıklar. Hizmetlerimizi kullanarak, bu politikada açıklanan uygulamaları kabul etmiş olursunuz. Veri güvenliğiniz bizim için önemlidir ve verilerinizi korumak için gerekli tüm önlemleri alıyoruz. Topladığımız veriler, hizmetlerimizi iyileştirmek, size daha iyi bir deneyim sunmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılır. Verilerinizi üçüncü taraflarla izniniz olmadan paylaşmayız, ancak yasal gereklilikler veya hizmet sağlayıcılarımızla işbirliği durumları istisna teşkil edebilir. Gizlilik haklarınızla ilgili daha fazla bilgi için lütfen bizimle iletişime geçin.",
        cookie_policy_title: "Çerezlerin Kullanımı",
        cookie_policy_text: "Web sitemiz, kullanıcı deneyiminizi geliştirmek ve hizmetlerimizi analiz etmek için çerezler kullanır. Çerezler, tarayıcınız tarafından bilgisayarınızda depolanan küçük metin dosyalarıdır. Bu çerezler, tercihlerinizi hatırlamamıza, site trafiğini analiz etmemize ve size kişiselleştirilmiş içerik sunmamıza yardımcı olur. Çerezleri istediğiniz zaman tarayıcı ayarlarınızdan kontrol edebilir ve silebilirsiniz. Ancak, çerezleri devre dışı bırakmanız durumunda web sitemizin bazı özelliklerinin düzgün çalışmayabileceğini lütfen unutmayın. Daha fazla bilgi için çerez politikamızı inceleyebilirsiniz.",
        terms_of_use_title: "Kullanım Şartları",
        terms_of_use_text: "mrCetin Tech web sitesini kullanarak, aşağıdaki kullanım şartlarını kabul etmiş olursunuz. Bu şartlar, web sitemizin kullanımı, içeriği, fikri mülkiyet hakları ve sorumluluk sınırlamaları ile ilgili hükümler içerir. Web sitemizdeki içerikler yalnızca genel bilgi amaçlıdır ve herhangi bir yasal tavsiye niteliği taşımaz. Hizmetlerimizi kötüye kullanmamanız, yasa dışı faaliyetlerde bulunmamanız ve diğer kullanıcıların haklarına saygı göstermeniz beklenir. Bu şartları ihlal etmeniz durumunda, hizmetlerimize erişiminiz kısıtlanabilir veya sonlandırılabilir. Lütfen bu şartları dikkatlice okuyunuz.",
        legal_notice_title: "Yasal Bildirim",
        legal_notice_text: "Bu yasal bildirim, mrCetin Tech'in yasal bilgilerini, şirket detaylarını ve telif hakkı beyanlarını içerir. Web sitemizdeki tüm içerikler, metinler, grafikler, logolar ve yazılımlar mrCetin Tech'e aittir veya lisanslıdır ve telif hakkı yasalarıyla korunmaktadır. İzinsiz çoğaltma, dağıtım veya kullanım yasaktır. Web sitemizde yer alan bilgiler iyi niyetle sunulmuştur, ancak doğruluğu veya eksiksizliği konusunda garanti verilmez. Herhangi bir yasal sorunuz veya endişeniz varsa, lütfen yetkili bir hukuk danışmanına başvurunuz.",
        sitemap_title: "Site Haritası",
        sitemap_text: "mrCetin Tech web sitesinin tüm sayfalarına hızlı erişim için site haritası. Ana Sayfa, Uygulamalarımız, Biz Kimiz, Vizyon, Misyon, İletişim, Gizlilik Politikası, Çerezlerin Kullanımı, Kullanım Şartları, Yasal Bildirim gibi ana bölümleri içerir. Bu harita, web sitemizde gezinmenizi kolaylaştırmak ve aradığınız bilgilere daha hızlı ulaşmanızı sağlamak amacıyla hazırlanmıştır. Herhangi bir sayfa bağlantısının çalışmaması durumunda lütfen bizimle iletişime geçin."
    },
    en: {
        page_title: "mrCetin Tech - Mobile App & Game Design",
        nav_applications: "Our Applications",
        nav_about_us: "About Us",
        nav_vision: "Vision",
        nav_mission: "Mission",
        nav_contact: "Contact",
        hero_title: "Innovative Mobile App & Game Experiences",
        hero_subtitle: "Bringing your dreams to the digital world.",
        hero_button: "Explore Our Projects",
        applications_title: "Our Applications",
        applications_text: "Here you will find examples of our mobile app and game projects.",
        game_project_1_title: "Game Project 1",
        game_project_1_description: "An exciting vocational training game. In development.",
        game_project_2_title: "Game Project 2",
        game_project_2_description: "A nostalgic challenge experience. In development.",
        mobile_app_project_title: "Mobile App Project",
        mobile_app_project_description: "An application that will enhance your travel experience and complete your route's deficiencies. Coming soon.",
        status_in_development: "In Development",
        status_coming_soon: "Coming Soon",
        about_us_title: "Who We Are",
        about_us_text_p1: "We are a technology and communication studio that operates with principles of high technical accuracy, security, and sustainability in mobile application and digital product development processes.",
        about_us_text_p2: "We adopt an approach that simplifies complex infrastructures, optimizes processes with automation, and presents every step in a documented manner.",
        about_us_text_p3: "In critical components such as application architecture, data security, user experience, and communication infrastructure; we develop solutions focused on both engineering and strategy.",
        about_us_text_p4: "Every project is designed not only to be functional but also to be integrated into corporate identity, suitable for long-term success, and technically sustainable.",
        about_us_text_p5: "To enable brands to leave a strong mark in the digital world; we professionally structure their technical infrastructures and strategically shape their communication languages.",
        about_us_text_p6: "Because we are not just developers of digital products; we are solution partners who carry them into the future, guide them, and generate value.",
        vision_title: "Vision",
        vision_text: "To be a reference point in the digital world by building technical infrastructures for institutions in a simple, secure, and scalable manner, with the principle of excellence in information security, system sustainability, and digital communication. With highly structured systems and strategic communication solutions, we aim to create an ecosystem that guides technology, provides leadership, and generates value.",
        mission_title: "Mission",
        mission_text: "To simplify complex technological processes by offering holistic solutions in email security, chained certificate integration, automation, and brand communication. In every project, we act with the principles of technical accuracy, sustainability, and user-centricity, enabling institutions to position their digital assets securely, professionally, and effectively.",
        contact_title: "Contact",
        contact_text: "Reach out to us and let's discuss your project.",
        contact_address: "Çekmeköy, Istanbul, Turkey",
        contact_phone: "Phone: +90531-932 33 96",
        contact_email: "Email: admin@mrcetin.com",
        footer_privacy: "Privacy Policy",
        footer_cookies: "Use of Cookies",
        footer_terms: "Terms of Use",
        footer_legal: "Legal",
        footer_sitemap: "Sitemap",
        footer_copyright: "© 2025 mrCetin Tech. All Rights Reserved.",
        privacy_policy_title: "Privacy Policy",
        privacy_policy_text: "This privacy policy explains how mrCetin Tech collects, uses, discloses, and protects your personal data. By using our services, you agree to the practices described in this policy. Your data security is important to us, and we take all necessary measures to protect your data. The data we collect is used to improve our services, provide you with a better experience, and fulfill our legal obligations. We do not share your data with third parties without your consent, but legal requirements or collaborations with our service providers may constitute an exception. For more information about your privacy rights, please contact us.",
        cookie_policy_title: "Use of Cookies",
        cookie_policy_text: "Our website uses cookies to enhance your user experience and analyze our services. Cookies are small text files stored on your computer by your browser. These cookies help us remember your preferences, analyze site traffic, and provide you with personalized content. You can control and delete cookies at any time through your browser settings. However, please note that some features of our website may not function properly if you disable cookies. For more information, please review our cookie policy.",
        terms_of_use_title: "Terms of Use",
        terms_of_use_text: "By using the mrCetin Tech website, you agree to the following terms of use. These terms include provisions regarding the use of our website, its content, intellectual property rights, and limitations of liability. The content on our website is for general informational purposes only and does not constitute legal advice. You are expected not to misuse our services, engage in illegal activities, and respect the rights of other users. In case of violation of these terms, your access to our services may be restricted or terminated. Please read these terms carefully.",
        legal_notice_title: "Legal Notice",
        legal_notice_text: "This legal notice contains legal information, company details, and copyright statements of mrCetin Tech. All content, texts, graphics, logos, and software on our website are owned by or licensed to mrCetin Tech and are protected by copyright laws. Unauthorized reproduction, distribution, or use is prohibited. The information on our website is provided in good faith, but no guarantee is given as to its accuracy or completeness. If you have any legal questions or concerns, please consult a qualified legal advisor.",
        sitemap_title: "Sitemap",
        sitemap_text: "Sitemap for quick access to all pages of the mrCetin Tech website. Includes main sections such as Home, Our Applications, About Us, Vision, Mission, Contact, Privacy Policy, Use of Cookies, Terms of Use, Legal Notice. This map is designed to facilitate your navigation on our website and help you find the information you are looking for more quickly. Please contact us if any page link is not working."
    },
    de: {
        page_title: "mrCetin Tech - Mobile App & Spieldesign",
        nav_applications: "Unsere Anwendungen",
        nav_about_us: "Über Uns",
        nav_vision: "Vision",
        nav_mission: "Mission",
        nav_contact: "Kontakt",
        hero_title: "Innovative Mobile App- & Spielerlebnisse",
        hero_subtitle: "Wir bringen Ihre Träume in die digitale Welt.",
        hero_button: "Unsere Projekte Entdecken",
        applications_title: "Unsere Anwendungen",
        applications_text: "Hier finden Sie Beispiele unserer mobilen App- und Spielprojekte.",
        game_project_1_title: "Spielprojekt 1",
        game_project_1_description: "Ein spannendes Berufsbildungsspiel. In Entwicklung.",
        game_project_2_title: "Spielprojekt 2",
        game_project_2_description: "Ein nostalgisches Herausforderungserlebnis. In Entwicklung.",
        mobile_app_project_title: "Mobile App Projekt",
        mobile_app_project_description: "Eine Anwendung, die Ihr Reiseerlebnis verbessert und die Mängel Ihrer Route behebt. Bald verfügbar.",
        status_in_development: "In Entwicklung",
        status_coming_soon: "Bald Verfügbar",
        about_us_title: "Wer Wir Sind",
        about_us_text_p1: "Wir sind ein Technologie- und Kommunikationsstudio, das in den Prozessen der Entwicklung mobiler Anwendungen und digitaler Produkte mit den Prinzipien hoher technischer Genauigkeit, Sicherheit und Nachhaltigkeit arbeitet.",
        about_us_text_p2: "Wir verfolgen einen Ansatz, der komplexe Infrastrukturen vereinfacht, Prozesse durch Automatisierung optimiert und jeden Schritt dokumentiert präsentiert.",
        about_us_text_p3: "In kritischen Komponenten wie Anwendungsarchitektur, Datensicherheit, Benutzererfahrung und Kommunikationsinfrastruktur entwickeln wir sowohl ingenieur- als auch strategieorientierte Lösungen.",
        about_us_text_p4: "Jedes Projekt wird nicht nur funktional, sondern auch in die Unternehmensidentität integriert, auf langfristigen Erfolg ausgerichtet und technisch nachhaltig gestaltet.",
        about_us_text_p5: "Damit Marken in der digitalen Welt einen starken Eindruck hinterlassen können; strukturieren wir ihre technischen Infrastrukturen professionell und gestalten ihre Kommunikationssprachen strategisch.",
        about_us_text_p6: "Denn wir sind nicht nur Entwickler digitaler Produkte; wir sind Lösungspartner, die sie in die Zukunft tragen, leiten und Werte schaffen.",
        vision_title: "Vision",
        vision_text: "Mit dem Prinzip der Exzellenz in Informationssicherheit, Systemnachhaltigkeit und digitaler Kommunikation; technische Infrastrukturen von Institutionen einfach, sicher und skalierbar aufzubauen, um ein Referenzpunkt in der digitalen Welt zu werden. Mit hochstrukturierten Systemen und strategischen Kommunikationslösungen streben wir danach, ein Ökosystem zu schaffen, das Technologie vorantreibt, leitet und Werte schafft.",
        mission_title: "Mission",
        mission_text: "Komplexe technologische Prozesse zu vereinfachen, indem wir ganzheitliche Lösungen in den Bereichen E-Mail-Sicherheit, Integration von Kettenzertifikaten, Automatisierung und Markenkommunikation anbieten. In jedem Projekt handeln wir nach den Prinzipien der technischen Genauigkeit, Nachhaltigkeit und Benutzerorientierung, um sicherzustellen, dass Institutionen ihre digitalen Assets sicher, professionell und effektiv positionieren.",
        contact_title: "Kontakt",
        contact_text: "Kontaktieren Sie uns und lassen Sie uns Ihr Projekt besprechen.",
        contact_address: "Çekmeköy, Istanbul, Türkei",
        contact_phone: "Telefon: +90531-932 33 96",
        contact_email: "E-Mail: admin@mrcetin.com",
        footer_privacy: "Datenschutzrichtlinie",
        footer_cookies: "Verwendung von Cookies",
        footer_terms: "Nutzungsbedingungen",
        footer_legal: "Rechtliches",
        footer_sitemap: "Sitemap",
        footer_copyright: "© 2025 mrCetin Tech. Alle Rechte vorbehalten.",
        privacy_policy_title: "Datenschutzrichtlinie",
        privacy_policy_text: "Diese Datenschutzrichtlinie erklärt, wie mrCetin Tech Ihre persönlichen Daten sammelt, verwendet, offenlegt und schützt. Durch die Nutzung unserer Dienste stimmen Sie den in dieser Richtlinie beschriebenen Praktiken zu. Ihre Datensicherheit ist uns wichtig, und wir ergreifen alle notwendigen Maßnahmen, um Ihre Daten zu schützen. Die von uns gesammelten Daten werden verwendet, um unsere Dienste zu verbessern, Ihnen ein besseres Erlebnis zu bieten und unsere gesetzlichen Verpflichtungen zu erfüllen. Wir geben Ihre Daten ohne Ihre Zustimmung nicht an Dritte weiter, es sei denn, dies ist gesetzlich vorgeschrieben oder erfolgt in Zusammenarbeit mit unseren Dienstleistern. Für weitere Informationen zu Ihren Datenschutzrechten kontaktieren Sie uns bitte.",
        cookie_policy_title: "Verwendung von Cookies",
        cookie_policy_text: "Unsere Website verwendet Cookies, um Ihr Benutzererlebnis zu verbessern und unsere Dienste zu analysieren. Cookies sind kleine Textdateien, die von Ihrem Browser auf Ihrem Computer gespeichert werden. Diese Cookies helfen uns, Ihre Präferenzen zu speichern, den Website-Verkehr zu analysieren und Ihnen personalisierte Inhalte anzubieten. Sie können Cookies jederzeit über Ihre Browsereinstellungen steuern und löschen. Bitte beachten Sie jedoch, dass einige Funktionen unserer Website möglicherweise nicht ordnungsgemäß funktionieren, wenn Sie Cookies deaktivieren. Weitere Informationen finden Sie in unserer Cookie-Richtlinie.",
        terms_of_use_title: "Nutzungsbedingungen",
        terms_of_use_text: "Durch die Nutzung der mrCetin Tech-Website stimmen Sie den folgenden Nutzungsbedingungen zu. Diese Bedingungen enthalten Bestimmungen zur Nutzung unserer Website, deren Inhalt, geistigen Eigentumsrechten und Haftungsbeschränkungen. Die Inhalte unserer Website dienen nur zu allgemeinen Informationszwecken und stellen keine Rechtsberatung dar. Es wird erwartet, dass Sie unsere Dienste nicht missbrauchen, keine illegalen Aktivitäten ausüben und die Rechte anderer Nutzer respektieren. Im Falle eines Verstoßes gegen diese Bedingungen kann Ihr Zugang zu unseren Diensten eingeschränkt oder beendet werden. Bitte lesen Sie diese Bedingungen sorgfältig durch.",
        legal_notice_title: "Rechtliches",
        legal_notice_text: "Dieser rechtliche Hinweis enthält rechtliche Informationen, Unternehmensdetails und Urheberrechtserklärungen von mrCetin Tech. Alle Inhalte, Texte, Grafiken, Logos und Software auf unserer Website sind Eigentum von mrCetin Tech oder lizenziert und durch Urheberrechtsgesetze geschützt. Unerlaubte Vervielfältigung, Verbreitung oder Nutzung ist untersagt. Die Informationen auf unserer Website werden nach bestem Wissen und Gewissen bereitgestellt, es wird jedoch keine Garantie für deren Richtigkeit oder Vollständigkeit übernommen. Bei rechtlichen Fragen oder Bedenken wenden Sie sich bitte an einen qualifizierten Rechtsberater.",
        sitemap_title: "Sitemap",
        sitemap_text: "Sitemap für den schnellen Zugriff auf alle Seiten der mrCetin Tech-Website. Enthält Hauptbereiche wie Startseite, Unsere Anwendungen, Über Uns, Vision, Mission, Kontakt, Datenschutzrichtlinie, Verwendung von Cookies, Nutzungsbedingungen, Rechtliches. Diese Karte soll Ihnen die Navigation auf unserer Website erleichtern und Ihnen helfen, die gesuchten Informationen schneller zu finden. Bitte kontaktieren Sie uns, wenn ein Seitenlink nicht funktioniert."
    },
    es: {
        page_title: "mrCetin Tech - Diseño de Apps Móviles y Juegos",
        nav_applications: "Nuestras Aplicaciones",
        nav_about_us: "Quiénes Somos",
        nav_vision: "Visión",
        nav_mission: "Misión",
        nav_contact: "Contacto",
        hero_title: "Experiencias Innovadoras en Apps Móviles y Juegos",
        hero_subtitle: "Llevamos tus sueños al mundo digital.",
        hero_button: "Explorar Nuestros Proyectos",
        applications_title: "Nuestras Aplicaciones",
        applications_text: "Aquí encontrará ejemplos de nuestros proyectos de aplicaciones móviles y juegos.",
        game_project_1_title: "Proyecto de Juego 1",
        game_project_1_description: "Un emocionante juego de formación profesional. En desarrollo.",
        game_project_2_title: "Proyecto de Juego 2",
        game_project_2_description: "Una experiencia de desafío nostálgica. En desarrollo.",
        mobile_app_project_title: "Proyecto de Aplicación Móvil",
        mobile_app_project_description: "Una aplicación que mejorará tu experiencia de viaje y completará las deficiencias de tu ruta. Próximamente.",
        status_in_development: "En Desarrollo",
        status_coming_soon: "Próximamente",
        about_us_title: "Quiénes Somos",
        about_us_text_p1: "Somos un estudio de tecnología y comunicación que opera con principios de alta precisión técnica, seguridad y sostenibilidad en los procesos de desarrollo de aplicaciones móviles y productos digitales.",
        about_us_text_p2: "Adoptamos un enfoque que simplifica infraestructuras complejas, optimiza procesos con automatización y presenta cada paso de manera documentada.",
        about_us_text_p3: "En componentes críticos como la arquitectura de aplicaciones, la seguridad de datos, la experiencia del usuario y la infraestructura de comunicación; desarrollamos soluciones centradas tanto en la ingeniería como en la estrategia.",
        about_us_text_p4: "Cada proyecto está diseñado no solo para ser funcional, sino también para integrarse en la identidad corporativa, ser adecuado para el éxito a largo plazo y técnicamente sostenible.",
        about_us_text_p5: "Para que las marcas dejen una huella fuerte en el mundo digital; estructuramos profesionalmente sus infraestructuras técnicas y damos forma estratégica a sus lenguajes de comunicación.",
        about_us_text_p6: "Porque no somos solo desarrolladores de productos digitales; somos socios de soluciones que los llevan al futuro, los guían y generan valor.",
        vision_title: "Visión",
        vision_text: "Con el principio de excelencia en seguridad de la información, sostenibilidad del sistema y comunicación digital; construir infraestructuras técnicas para instituciones de manera sencilla, segura y escalable para ser un punto de referencia en el mundo digital. Con sistemas altamente estructurados y soluciones de comunicación estratégica; nuestro objetivo es crear un ecosistema que impulse la tecnología, brinde orientación y genere valor.",
        mission_title: "Misión",
        mission_text: "Simplificar procesos tecnológicos complejos ofreciendo soluciones integrales en seguridad de correo electrónico, integración de certificados en cadena, automatización y comunicación de marca. En cada proyecto, actuamos con los principios de precisión técnica, sostenibilidad y enfoque en el usuario; asegurando que las instituciones posicionen sus activos digitales de manera segura, profesional y efectiva.",
        contact_title: "Contacto",
        contact_text: "Contáctenos y hablemos de su proyecto.",
        contact_address: "Çekmeköy, Estambul, Turquía",
        contact_phone: "Teléfono: +90531-932 33 96",
        contact_email: "Correo electrónico: admin@mrcetin.com",
        footer_privacy: "Política de Privacidad",
        footer_cookies: "Uso de Cookies",
        footer_terms: "Términos de Uso",
        footer_legal: "Legal",
        footer_sitemap: "Mapa del Sitio",
        footer_copyright: "© 2025 mrCetin Tech. Todos los derechos reservados.",
        privacy_policy_title: "Política de Privacidad",
        privacy_policy_text: "Esta política de privacidad explica cómo mrCetin Tech recopila, utiliza, divulga y protege sus datos personales. Al utilizar nuestros servicios, usted acepta las prácticas descritas en esta política. La seguridad de sus datos es importante para nosotros y tomamos todas las medidas necesarias para protegerlos. Los datos que recopilamos se utilizan para mejorar nuestros servicios, brindarle una mejor experiencia y cumplir con nuestras obligaciones legales. No compartimos sus datos con terceros sin su consentimiento, pero los requisitos legales o las colaboraciones con nuestros proveedores de servicios pueden constituir una excepción. Para obtener más información sobre sus derechos de privacidad, contáctenos.",
        cookie_policy_title: "Uso de Cookies",
        cookie_policy_text: "Nuestro sitio web utiliza cookies para mejorar su experiencia de usuario y analizar nuestros servicios. Las cookies son pequeños archivos de texto almacenados en su computadora por su navegador. Estas cookies nos ayudan a recordar sus preferencias, analizar el tráfico del sitio y brindarle contenido personalizado. Puede controlar y eliminar las cookies en cualquier momento a través de la configuración de su navegador. Sin embargo, tenga en cuenta que algunas funciones de nuestro sitio web pueden no funcionar correctamente si desactiva las cookies. Para obtener más información, revise nuestra política de cookies.",
        terms_of_use_title: "Términos de Uso",
        terms_of_use_text: "Al utilizar el sitio web de mrCetin Tech, usted acepta los siguientes términos de uso. Estos términos incluyen disposiciones sobre el uso de nuestro sitio web, su contenido, derechos de propiedad intelectual y limitaciones de responsabilidad. El contenido de nuestro sitio web es solo para fines informativos generales y no constituye asesoramiento legal. Se espera que no haga un mal uso de nuestros servicios, no participe en actividades ilegales y respete los derechos de otros usuarios. En caso de incumplimiento de estos términos, su acceso a nuestros servicios puede ser restringido o terminado. Lea atentamente estos términos.",
        legal_notice_title: "Aviso Legal",
        legal_notice_text: "Este aviso legal contiene información legal, detalles de la empresa y declaraciones de derechos de autor de mrCetin Tech. Todo el contenido, textos, gráficos, logotipos y software de nuestro sitio web son propiedad de mrCetin Tech o están licenciados y protegidos por las leyes de derechos de autor. Se prohíbe la reproducción, distribución o uso no autorizado. La información de nuestro sitio web se proporciona de buena fe, pero no se garantiza su exactitud o integridad. Si tiene alguna pregunta o inquietud legal, consulte a un asesor legal calificado.",
        sitemap_title: "Mapa del Sitio",
        sitemap_text: "Mapa del sitio para un acceso rápido a todas las páginas del sitio web de mrCetin Tech. Incluye secciones principales como Inicio, Nuestras Aplicaciones, Quiénes Somos, Visión, Misión, Contacto, Política de Privacidad, Uso de Cookies, Términos de Uso, Aviso Legal. Este mapa está diseñado para facilitar su navegación en nuestro sitio web y ayudarlo a encontrar la información que busca más rápidamente. Contáctenos si algún enlace de página no funciona."
    },
    ru: {
        page_title: "mrCetin Tech - Дизайн Мобильных Приложений и Игр",
        nav_applications: "Наши Приложения",
        nav_about_us: "О Нас",
        nav_vision: "Видение",
        nav_mission: "Миссия",
        nav_contact: "Контакты",
        hero_title: "Инновационные Мобильные Приложения и Игровые Опыты",
        hero_subtitle: "Мы воплощаем ваши мечты в цифровой мир.",
        hero_button: "Изучить Наши Проекты",
        applications_title: "Наши Приложения",
        applications_text: "Здесь вы найдете примеры наших проектов мобильных приложений и игр.",
        game_project_1_title: "Игровой Проект 1",
        game_project_1_description: "Увлекательная игра для профессионального обучения. В разработке.",
        game_project_2_title: "Игровой Проект 2",
        game_project_2_description: "Ностальгический опыт испытаний. В разработке.",
        mobile_app_project_title: "Проект Мобильного Приложения",
        mobile_app_project_description: "Приложение, которое улучшит ваш опыт путешествий и устранит недостатки вашего маршрута. Скоро будет доступно.",
        status_in_development: "В Разработке",
        status_coming_soon: "Скоро",
        about_us_title: "Кто Мы",
        about_us_text_p1: "Мы — студия технологий и коммуникаций, которая в процессах разработки мобильных приложений и цифровых продуктов руководствуется принципами высокой технической точности, безопасности и устойчивости.",
        about_us_text_p2: "Мы применяем подход, который упрощает сложные инфраструктуры, оптимизирует процессы с помощью автоматизации и представляет каждый шаг в документированном виде.",
        about_us_text_p3: "В таких критически важных компонентах, как архитектура приложений, безопасность данных, пользовательский опыт и коммуникационная инфраструктура; мы разрабатываем решения, ориентированные как на инженерию, так и на стратегию.",
        about_us_text_p4: "Каждый проект разрабатывается не только функциональным, но и интегрированным в корпоративную идентичность, подходящим для долгосрочного успеха и технически устойчивым.",
        about_us_text_p5: "Чтобы бренды могли оставить сильный след в цифровом мире; мы профессионально структурируем их технические инфраструктуры и стратегически формируем их языки коммуникации.",
        about_us_text_p6: "Потому что мы не просто разработчики цифровых продуктов; мы — партнеры по решениям, которые несут их в будущее, направляют и создают ценность.",
        vision_title: "Видение",
        vision_text: "С принципом превосходства в информационной безопасности, устойчивости систем и цифровой коммуникации; строить технические инфраструктуры для учреждений простым, безопасным и масштабируемым способом, чтобы стать эталоном в цифровом мире. С высокоструктурированными системами и стратегическими коммуникационными решениями; мы стремимся создать экосистему, которая направляет технологии, обеспечивает лидерство и создает ценность.",
        mission_title: "Миссия",
        mission_text: "Упрощать сложные технологические процессы, предлагая комплексные решения в области безопасности электронной почты, интеграции цепочечных сертификатов, автоматизации и брендовой коммуникации. В каждом проекте мы действуем в соответствии с принципами технической точности, устойчивости и ориентированности на пользователя; обеспечивая безопасное, профессиональное и эффективное позиционирование цифровых активов учреждений.",
        contact_title: "Контакты",
        contact_text: "Свяжитесь с нами, и давайте обсудим ваш проект.",
        contact_address: "Чекмекёй, Стамбул, Турция",
        contact_phone: "Телефон: +90531-932 33 96",
        contact_email: "Электронная почта: admin@mrcetin.com",
        footer_privacy: "Политика Конфиденциальности",
        footer_cookies: "Использование Файлов Cookie",
        footer_terms: "Условия Использования",
        footer_legal: "Юридическая Информация",
        footer_sitemap: "Карта Сайта",
        footer_copyright: "© 2025 mrCetin Tech. Все права защищены.",
        privacy_policy_title: "Политика Конфиденциальности",
        privacy_policy_text: "Эта политика конфиденциальности объясняет, как mrCetin Tech собирает, использует, раскрывает и защищает ваши персональные данные. Используя наши услуги, вы соглашаетесь с практиками, описанными в этой политике. Безопасность ваших данных важна для нас, и мы принимаем все необходимые меры для защиты ваших данных. Собранные нами данные используются для улучшения наших услуг, предоставления вам лучшего опыта и выполнения наших юридических обязательств. Мы не передаем ваши данные третьим лицам без вашего согласия, но юридические требования или сотрудничество с нашими поставщиками услуг могут составлять исключение. Для получения дополнительной информации о ваших правах на конфиденциальность, пожалуйста, свяжитесь с нами.",
        cookie_policy_title: "Использование Файлов Cookie",
        cookie_policy_text: "Наш веб-сайт использует файлы cookie для улучшения вашего пользовательского опыта и анализа наших услуг. Файлы cookie — это небольшие текстовые файлы, хранящиеся на вашем компьютере вашим браузером. Эти файлы cookie помогают нам запоминать ваши предпочтения, анализировать трафик сайта и предоставлять вам персонализированный контент. Вы можете контролировать и удалять файлы cookie в любое время через настройки вашего браузера. Однако, пожалуйста, обратите внимание, что некоторые функции нашего веб-сайта могут работать некорректно, если вы отключите файлы cookie. Для получения дополнительной информации, пожалуйста, ознакомьтесь с нашей политикой использования файлов cookie.",
        terms_of_use_title: "Условия Использования",
        terms_of_use_text: "Используя веб-сайт mrCetin Tech, вы соглашаетесь со следующими условиями использования. Эти условия включают положения, касающиеся использования нашего веб-сайта, его содержимого, прав интеллектуальной собственности и ограничений ответственности. Содержимое нашего веб-сайта предназначено только для общих информационных целей и не является юридической консультацией. Ожидается, что вы не будете злоупотреблять нашими услугами, участвовать в незаконной деятельности и уважать права других пользователей. В случае нарушения этих условий ваш доступ к нашим услугам может быть ограничен или прекращен. Пожалуйста, внимательно прочитайте эти условия.",
        legal_notice_title: "Юридическая Информация",
        legal_notice_text: "Это юридическое уведомление содержит юридическую информацию, сведения о компании и заявления об авторских правах mrCetin Tech. Все содержимое, тексты, графика, логотипы и программное обеспечение на нашем веб-сайте принадлежат mrCetin Tech или лицензированы и защищены законами об авторском праве. Несанкционированное воспроизведение, распространение или использование запрещено. Информация на нашем веб-сайте предоставляется добросовестно, но не гарантируется ее точность или полнота. Если у вас есть какие-либо юридические вопросы или опасения, пожалуйста, проконсультируйтесь с квалифицированным юрисконсультом.",
        sitemap_title: "Карта Сайта",
        sitemap_text: "Карта сайта для быстрого доступа ко всем страницам веб-сайта mrCetin Tech. Включает основные разделы, такие как Главная страница, Наши Приложения, О Нас, Видение, Миссия, Контакты, Политика Конфиденциальности, Использование Файлов Cookie, Условия Использования, Юридическая Информация. Эта карта предназначена для облегчения навигации по нашему веб-сайту и помощи в более быстром поиске нужной информации. Пожалуйста, свяжитесь с нами, если какая-либо ссылка на страницу не работает."
    },
    ja: {
        page_title: "mrCetin Tech - モバイルアプリ＆ゲームデザイン",
        nav_applications: "私たちのアプリ",
        nav_about_us: "会社概要",
        nav_vision: "ビジョン",
        nav_mission: "ミッション",
        nav_contact: "お問い合わせ",
        hero_title: "革新的なモバイルアプリ＆ゲーム体験",
        hero_subtitle: "あなたの夢をデジタル世界へ。",
        hero_button: "プロジェクトを見る",
        applications_title: "私たちのアプリ",
        applications_text: "モバイルアプリとゲームプロジェクトの例をこちらでご覧いただけます。",
        game_project_1_title: "ゲームプロジェクト1",
        game_project_1_description: "エキサイティングな職業訓練ゲーム。開発中。",
        game_project_2_title: "ゲームプロジェクト2",
        game_project_2_description: "ノスタルジックな挑戦体験。開発中。",
        mobile_app_project_title: "モバイルアプリプロジェクト",
        mobile_app_project_description: "旅行体験を向上させ、ルートの不足を補うアプリケーション。近日公開予定。",        status_in_development: "開発中",
        status_coming_soon: "近日公開",
        about_us_title: "会社概要",
        about_us_text_p1: "モバイルアプリケーションおよびデジタル製品開発プロセスにおいて、高い技術的正確性、セキュリティ、持続可能性の原則に基づいて運営するテクノロジーおよびコミュニケーションスタジオです。",
        about_us_text_p2: "複雑なインフラストラクチャを簡素化し、自動化によってプロセスを最適化し、すべてのステップを文書化された方法で提示するアプローチを採用しています。",
        about_us_text_p3: "アプリケーションアーキテクチャ、データセキュリティ、ユーザーエクスペリエンス、コミュニケーションインフラストラクチャなどの重要なコンポーネントにおいて、エンジニアリングと戦略の両方に焦点を当てたソリューションを開発しています。",
        about_us_text_p4: "すべてのプロジェクトは、機能的であるだけでなく、企業アイデンティティに統合され、長期的な成功に適しており、技術的に持続可能であるように設計されています。",
        about_us_text_p5: "ブランドがデジタル世界で強い足跡を残せるように、技術インフラを専門的に構築し、コミュニケーション言語を戦略的に形成しています。",
        about_us_text_p6: "なぜなら、私たちはデジタル製品の開発者であるだけでなく、それらを未来へと導き、価値を生み出すソリューションパートナーだからです。",
        vision_title: "ビジョン",
        vision_text: "情報セキュリティ、システム持続可能性、デジタルコミュニケーションにおける卓越性の原則に基づき、企業の技術インフラをシンプル、安全、スケーラブルな方法で構築し、デジタル世界で足跡を残す参照点となること。高度に構造化されたシステムと戦略的なコミュニケーションソリューションにより、テクノロジーを推進し、指導し、価値を生み出すエコシステムを構築することを目指しています。",
        mission_title: "ミッション",
        mission_text: "複雑な技術プロセスを簡素化し、メールセキュリティ、チェーン証明書統合、自動化、ブランドコミュニケーションの分野で包括的なソリューションを提供すること。すべてのプロジェクトにおいて、技術的正確性、持続可能性、ユーザー中心主義の原則に基づいて行動し、企業がデジタル資産を安全、専門的、効果的に位置付けられるようにします。",
        contact_title: "お問い合わせ",
        contact_text: "お気軽にお問い合わせください。プロジェクトについて話し合いましょう。",
        contact_address: "チェクメキョイ、イスタンブール、トルコ",
        contact_phone: "電話: +90531-932 33 96",
        contact_email: "Eメール: admin@mrcetin.com",
        footer_privacy: "プライバシーポリシー",
        footer_cookies: "クッキーの使用",
        footer_terms: "利用規約",
        footer_legal: "法的情報",
        footer_sitemap: "サイトマップ",
        footer_copyright: "© 2025 mrCetin Tech. 全著作権所有。",
        privacy_policy_title: "プライバシーポリシー",
        privacy_policy_text: "このプライバシーポリシーは、mrCetin Techがお客様の個人データをどのように収集、使用、開示、保護するかを説明します。当社のサービスを利用することにより、お客様はこのポリシーに記載されている慣行に同意するものとします。お客様のデータセキュリティは当社にとって重要であり、当社はお客様のデータを保護するために必要なすべての措置を講じます。当社が収集するデータは、サービスの改善、より良い体験の提供、および法的義務の履行のために使用されます。お客様の同意なしに第三者とデータを共有することはありませんが、法的要件またはサービスプロバイダーとの協力は例外となる場合があります。プライバシー権に関する詳細については、お問い合わせください。",
        cookie_policy_title: "クッキーの使用",
        cookie_policy_text: "当社のウェブサイトは、ユーザーエクスペリエンスを向上させ、サービスを分析するためにクッキーを使用します。クッキーは、ブラウザによってコンピューターに保存される小さなテキストファイルです。これらのクッキーは、お客様の好み、サイトトラフィックの分析、パーソナライズされたコンテンツの提供に役立ちます。ブラウザの設定を通じていつでもクッキーを制御および削除できます。ただし、クッキーを無効にすると、当社のウェブサイトの一部の機能が正しく機能しない場合がありますのでご注意ください。詳細については、クッキーポリシーをご確認ください。",
        terms_of_use_title: "利用規約",
        terms_of_use_text: "mrCetin Techのウェブサイトを利用することにより、以下の利用規約に同意するものとします。これらの規約には、当社のウェブサイトの利用、そのコンテンツ、知的財産権、および責任の制限に関する規定が含まれます。当社のウェブサイトのコンテンツは一般的な情報提供のみを目的としており、法的助言を構成するものではありません。お客様は、当社のサービスを悪用したり、違法行為に従事したり、他のユーザーの権利を尊重したりしないことが期待されます。これらの規約に違反した場合、当社のサービスへのアクセスが制限または終了される場合があります。これらの規約を注意深くお読みください。",
        legal_notice_title: "法的情報",
        legal_notice_text: "この法的通知には、mrCetin Techの法的情報、会社詳細、および著作権表示が含まれています。当社のウェブサイト上のすべてのコンテンツ、テキスト、グラフィック、ロゴ、およびソフトウェアは、mrCetin Techが所有またはライセンスを受けており、著作権法によって保護されています。無断での複製、配布、または使用は禁止されています。当社のウェブサイトの情報は誠意を持って提供されていますが、その正確性または完全性については保証されません。法的な質問や懸念がある場合は、資格のある法律顧問にご相談ください。",
        sitemap_title: "サイトマップ",
        sitemap_text: "mrCetin Techウェブサイトのすべてのページにすばやくアクセスするためのサイトマップ。ホーム、私たちのアプリ、会社概要、ビジョン、ミッション、お問い合わせ、プライバシーポリシー、クッキーの使用、利用規約、法的情報などの主要セクションが含まれています。このマップは、ウェブサイトのナビゲーションを容易にし、探している情報にすばやくアクセスできるように設計されています。ページリンクが機能しない場合は、お問い合わせください。"
    },
    zh: {
        page_title: "mrCetin Tech - 移动应用与游戏设计",
        nav_applications: "我们的应用",
        nav_about_us: "关于我们",
        nav_vision: "愿景",
        nav_mission: "使命",
        nav_contact: "联系我们",
        hero_title: "创新的移动应用与游戏体验",
        hero_subtitle: "将您的梦想带入数字世界。",
        hero_button: "探索我们的项目",
        applications_title: "我们的应用",
        applications_text: "在这里您可以找到我们的移动应用和游戏项目示例。",
        game_project_1_title: "游戏项目1",
        game_project_1_description: "一款激动人心的职业培训游戏。开发中。",
        game_project_2_title: "游戏项目2",
        game_project_2_description: "怀旧的挑战体验。开发中。",
        mobile_app_project_title: "移动应用项目",
        mobile_app_project_description: "一款将提升您的旅行体验并弥补路线不足的应用程序。即将推出。",        status_in_development: "开发中",
        status_coming_soon: "即将推出",
        about_us_title: "关于我们",
        about_us_text_p1: "我们是一家技术与通信工作室，在移动应用和数字产品开发过程中，秉持高技术准确性、安全性和可持续性原则。",
        about_us_text_p2: "我们采用一种方法，简化复杂的架构，通过自动化优化流程，并以文档化的方式呈现每个步骤。",
        about_us_text_p3: "在应用架构、数据安全、用户体验和通信基础设施等关键组件中，我们开发了以工程和战略为导向的解决方案。",
        about_us_text_p4: "每个项目不仅功能齐全，而且与企业形象融为一体，适合长期成功，并具有技术可持续性。",
        about_us_text_p5: "为了让品牌在数字世界中留下深刻印记；我们专业地构建其技术基础设施，并战略性地塑造其沟通语言。",
        about_us_text_p6: "因为我们不仅是数字产品的开发者；我们是将其带向未来、提供指导并创造价值的解决方案合作伙伴。",
        vision_title: "愿景",
        vision_text: "以信息安全、系统可持续性和数字通信卓越为原则；以简洁、安全和可扩展的方式构建机构的技术基础设施，成为数字世界的参考点。通过高度结构化的系统和战略性沟通解决方案；我们旨在创建一个引导技术、提供指导并创造价值的生态系统。",
        mission_title: "使命",
        mission_text: "通过在电子邮件安全、链式证书集成、自动化和品牌沟通领域提供整体解决方案，简化复杂的技术流程。在每个项目中，我们都秉持技术准确性、可持续性和以用户为中心的原则；确保机构安全、专业和有效地定位其数字资产。",
        contact_title: "联系我们",
        contact_text: "联系我们，让我们讨论您的项目。",
        contact_address: "切克梅科伊，伊斯坦布尔，土耳其",
        contact_phone: "电话: +90531-932 33 96",
        contact_email: "电子邮件: admin@mrcetin.com",
        footer_privacy: "隐私政策",
        footer_cookies: "Cookie使用",
        footer_terms: "使用条款",
        footer_legal: "法律声明",
        footer_sitemap: "网站地图",
        footer_copyright: "© 2025 mrCetin Tech。保留所有权利。",
        privacy_policy_title: "隐私政策",
        privacy_policy_text: "本隐私政策解释了mrCetin Tech如何收集、使用、披露和保护您的个人数据。使用我们的服务即表示您同意本政策中描述的做法。您的数据安全对我们很重要，我们采取一切必要措施保护您的数据。我们收集的数据用于改进我们的服务，为您提供更好的体验，并履行我们的法律义务。未经您的同意，我们不会与第三方共享您的数据，但法律要求或与我们的服务提供商合作的情况可能构成例外。有关您的隐私权的更多信息，请联系我们。",
        cookie_policy_title: "Cookie使用",
        cookie_policy_text: "我们的网站使用Cookie来增强您的用户体验并分析我们的服务。Cookie是您的浏览器存储在您计算机上的小型文本文件。这些Cookie帮助我们记住您的偏好，分析网站流量，并为您提供个性化内容。您可以随时通过浏览器设置控制和删除Cookie。但是，请注意，如果您禁用Cookie，我们网站的某些功能可能无法正常运行。有关更多信息，请查看我们的Cookie政策。",
        terms_of_use_title: "使用条款",
        terms_of_use_text: "使用mrCetin Tech网站即表示您同意以下使用条款。这些条款包括有关我们网站的使用、其内容、知识产权和责任限制的规定。我们网站上的内容仅供一般信息参考，不构成法律建议。您应避免滥用我们的服务、从事非法活动并尊重其他用户的权利。如果违反这些条款，您对我们服务的访问可能会受到限制或终止。请仔细阅读这些条款。",
        legal_notice_title: "法律声明",
        legal_notice_text: "本法律声明包含mrCetin Tech的法律信息、公司详情和版权声明。我们网站上的所有内容、文本、图形、徽标和软件均由mrCetin Tech拥有或授权，并受版权法保护。未经授权的复制、分发或使用是禁止的。我们网站上的信息是善意提供的，但不保证其准确性或完整性。如果您有任何法律问题或疑虑，请咨询合格的法律顾问。",
        sitemap_title: "网站地图",
        sitemap_text: "mrCetin Tech网站所有页面的快速访问网站地图。包括主页、我们的应用、关于我们、愿景、使命、联系我们、隐私政策、Cookie使用、使用条款、法律声明等主要部分。此地图旨在方便您在我们网站上的导航，并帮助您更快地找到所需信息。如果任何页面链接无法正常工作，请联系我们。"
    },
    ko: {
        page_title: "mrCetin Tech - 모바일 앱 & 게임 디자인",
        nav_applications: "우리의 앱",
        nav_about_us: "회사 소개",
        nav_vision: "비전",
        nav_mission: "미션",
        nav_contact: "문의",
        hero_title: "혁신적인 모바일 앱 & 게임 경험",
        hero_subtitle: "당신의 꿈을 디지털 세상으로 가져옵니다.",
        hero_button: "프로젝트 탐색",
        applications_title: "우리의 앱",
        applications_text: "여기에서 모바일 앱 및 게임 프로젝트의 예시를 찾을 수 있습니다.",
        game_project_1_title: "게임 프로젝트 1",
        game_project_1_description: "흥미진진한 직업 훈련 게임. 개발 중.",
        game_project_2_title: "게임 프로젝트 2",
        game_project_2_description: "향수를 불러일으키는 도전 경험. 개발 중.",
        mobile_app_project_title: "모바일 앱 프로젝트",
        mobile_app_project_description: "여행 경험을 향상시키고 경로의 부족한 점을 보완할 애플리케이션. 곧 출시 예정.",        status_in_development: "개발 중",
        status_coming_soon: "출시 예정",
        about_us_title: "회사 소개",
        about_us_text_p1: "모바일 애플리케이션 및 디지털 제품 개발 프로세스에서 높은 기술적 정확성, 보안 및 지속 가능성 원칙에 따라 운영되는 기술 및 커뮤니케이션 스튜디오입니다.",
        about_us_text_p2: "복잡한 인프라를 단순화하고, 자동화를 통해 프로세스를 최적화하며, 모든 단계를 문서화된 방식으로 제시하는 접근 방식을 채택합니다.",
        about_us_text_p3: "애플리케이션 아키텍처, 데이터 보안, 사용자 경험 및 통신 인프라와 같은 중요한 구성 요소에서 엔지니어링 및 전략 중심 솔루션을 개발합니다.",
        about_us_text_p4: "모든 프로젝트는 기능적일 뿐만 아니라 기업 아이덴티티에 통합되고, 장기적인 성공에 적합하며, 기술적으로 지속 가능하도록 설계됩니다.",
        about_us_text_p5: "브랜드가 디지털 세계에서 강력한 흔적을 남길 수 있도록; 기술 인프라를 전문적으로 구축하고, 커뮤니케이션 언어를 전략적으로 형성합니다.",
        about_us_text_p6: "우리는 디지털 제품의 개발자일 뿐만 아니라; 미래로 이끌고, 안내하며, 가치를 창출하는 솔루션 파트너이기 때문입니다.",
        vision_title: "비전",
        vision_text: "정보 보안, 시스템 지속 가능성 및 디지털 커뮤니케이션의 우수성 원칙을 바탕으로; 기관의 기술 인프라를 단순하고 안전하며 확장 가능한 방식으로 구축하여 디지털 세계에서 흔적을 남기는 기준점이 되는 것입니다. 고도로 구조화된 시스템과 전략적 커뮤니케이션 솔루션을 통해; 기술을 선도하고, 지침을 제공하며, 가치를 창출하는 생태계를 구축하는 것을 목표로 합니다.",
        mission_title: "미션",
        mission_text: "복잡한 기술 프로세스를 단순화하여 이메일 보안, 체인 인증서 통합, 자동화 및 브랜드 커뮤니케이션 분야에서 전체적인 솔루션을 제공합니다. 모든 프로젝트에서 기술적 정확성, 지속 가능성 및 사용자 중심 원칙에 따라 행동하여; 기관이 디지털 자산을 안전하고 전문적이며 효과적으로 포지셔닝할 수 있도록 합니다.",
        contact_title: "문의",
        contact_text: "저희에게 연락하여 프로젝트에 대해 논의해 봅시다.",
        contact_address: "체크메쾨이, 이스탄불, 터키",
        contact_phone: "전화: +90531-932 33 96",
        contact_email: "이메일: admin@mrcetin.com",
        footer_privacy: "개인정보처리방침",
        footer_cookies: "쿠키 사용",
        footer_terms: "이용 약관",
        footer_legal: "법적 고지",
        footer_sitemap: "사이트맵",
        footer_copyright: "© 2025 mrCetin Tech. 모든 권리 보유.",
        privacy_policy_title: "개인정보처리방침",
        privacy_policy_text: "본 개인정보처리방침은 mrCetin Tech가 귀하의 개인 데이터를 수집, 사용, 공개 및 보호하는 방법을 설명합니다. 당사 서비스를 이용함으로써 귀하는 본 정책에 설명된 관행에 동의하는 것입니다. 귀하의 데이터 보안은 당사에 중요하며, 당사는 귀하의 데이터를 보호하기 위해 필요한 모든 조치를 취합니다. 당사가 수집하는 데이터는 서비스 개선, 더 나은 경험 제공 및 법적 의무 이행을 위해 사용됩니다. 당사는 귀하의 동의 없이 제3자와 귀하의 데이터를 공유하지 않지만, 법적 요구 사항 또는 서비스 제공업체와의 협력은 예외가 될 수 있습니다. 귀하의 개인정보 보호 권리에 대한 자세한 내용은 당사에 문의하십시오.",
        cookie_policy_title: "쿠키 사용",
        cookie_policy_text: "당사 웹사이트는 사용자 경험을 향상시키고 서비스를 분석하기 위해 쿠키를 사용합니다. 쿠키는 브라우저에 의해 컴퓨터에 저장되는 작은 텍스트 파일입니다. 이러한 쿠키는 귀하의 선호도를 기억하고, 사이트 트래픽을 분석하며, 개인화된 콘텐츠를 제공하는 데 도움이 됩니다. 브라우저 설정을 통해 언제든지 쿠키를 제어하고 삭제할 수 있습니다. 그러나 쿠키를 비활성화하면 당사 웹사이트의 일부 기능이 제대로 작동하지 않을 수 있습니다. 자세한 내용은 쿠키 정책을 검토하십시오.",
        terms_of_use_title: "이용 약관",
        terms_of_use_text: "mrCetin Tech 웹사이트를 이용함으로써 귀하는 다음 이용 약관에 동의하는 것입니다. 이 약관에는 당사 웹사이트의 이용, 콘텐츠, 지적 재산권 및 책임 제한에 관한 조항이 포함됩니다. 당사 웹사이트의 콘텐츠는 일반적인 정보 제공 목적으로만 제공되며 법적 조언을 구성하지 않습니다. 귀하는 당사 서비스를 오용하거나 불법 활동에 참여하거나 다른 사용자의 권리를 존중하지 않을 것으로 예상됩니다. 이 약관을 위반하는 경우 당사 서비스에 대한 귀하의 접근이 제한되거나 종료될 수 있습니다. 이 약관을 주의 깊게 읽으십시오.",
        legal_notice_title: "법적 고지",
        legal_notice_text: "본 법적 고지에는 mrCetin Tech의 법적 정보, 회사 세부 정보 및 저작권 진술이 포함되어 있습니다. 당사 웹사이트의 모든 콘텐츠, 텍스트, 그래픽, 로고 및 소프트웨어는 mrCetin Tech가 소유하거나 라이선스를 받았으며 저작권법에 의해 보호됩니다. 무단 복제, 배포 또는 사용은 금지됩니다. 당사 웹사이트의 정보는 선의로 제공되지만, 정확성 또는 완전성에 대한 보증은 제공되지 않습니다. 법적 질문이나 우려 사항이 있는 경우 자격을 갖춘 법률 고문에게 문의하십시오.",
        sitemap_title: "사이트맵",
        sitemap_text: "mrCetin Tech 웹사이트의 모든 페이지에 빠르게 액세스하기 위한 사이트맵입니다. 홈, 우리의 앱, 회사 소개, 비전, 미션, 문의, 개인정보처리방침, 쿠키 사용, 이용 약관, 법적 고지 등 주요 섹션이 포함됩니다. 이 지도는 웹사이트 탐색을 용이하게 하고 원하는 정보를 더 빨리 찾을 수 있도록 설계되었습니다. 페이지 링크가 작동하지 않는 경우 당사에 문의하십시오."
    },
    ar: {
        page_title: "mrCetin Tech - تصميم تطبيقات الجوال والألعاب",
        nav_applications: "تطبيقاتنا",
        nav_about_us: "من نحن",
        nav_vision: "الرؤية",
        nav_mission: "المهمة",
        nav_contact: "اتصل بنا",
        hero_title: "تجارب مبتكرة لتطبيقات الجوال والألعاب",
        hero_subtitle: "نحول أحلامك إلى العالم الرقمي.",
        hero_button: "استكشف مشاريعنا",
        applications_title: "تطبيقاتنا",
        applications_text: "هنا ستجد أمثلة على مشاريع تطبيقات الجوال والألعاب لدينا.",
        game_project_1_title: "مشروع اللعبة 1",
        game_project_1_description: "لعبة تدريب مهني مثيرة. قيد التطوير.",
        game_project_2_title: "مشروع اللعبة 2",
        game_project_2_description: "تجربة تحدي حنينية. قيد التطوير.",
        mobile_app_project_title: "مشروع تطبيق جوال",
        mobile_app_project_description: "تطبيق سيعزز تجربة سفرك ويكمل أوجه القصور في مسارك. قريبا.",        status_in_development: "قيد التطوير",
        status_coming_soon: "قريبا",
        about_us_title: "من نحن",
        about_us_text_p1: "نحن استوديو تكنولوجيا واتصالات يعمل بمبادئ الدقة التقنية العالية والأمان والاستدامة في عمليات تطوير تطبيقات الجوال والمنتجات الرقمية.",
        about_us_text_p2: "نعتمد نهجًا يبسط البنى التحتية المعقدة، ويحسن العمليات من خلال الأتمتة، ويقدم كل خطوة بطريقة موثقة.",
        about_us_text_p3: "في المكونات الحيوية مثل بنية التطبيق، وأمن البيانات، وتجربة المستخدم، والبنية التحتية للاتصالات؛ نطور حلولًا تركز على الهندسة والاستراتيجية على حد سواء.",
        about_us_text_p4: "تم تصميم كل مشروع ليكون ليس فقط وظيفيًا؛ بل أيضًا متكاملًا مع الهوية المؤسسية، ومناسبًا للنجاح على المدى الطويل، ومستدامًا تقنيًا.",
        about_us_text_p5: "لتمكين العلامات التجارية من ترك بصمة قوية في العالم الرقمي؛ نقوم ببناء بنيتها التحتية التقنية باحترافية، ونشكل لغاتها الاتصالية بشكل استراتيجي.",
        about_us_text_p6: "لأننا لسنا مجرد مطورين للمنتجات الرقمية؛ بل نحن شركاء حلول يحملونها إلى المستقبل، ويوجهونها، ويولدون القيمة.",
        vision_title: "الرؤية",
        vision_text: "مع مبدأ التميز في أمن المعلومات، واستدامة الأنظمة، والاتصالات الرقمية؛ بناء البنى التحتية التقنية للمؤسسات بطريقة بسيطة وآمنة وقابلة للتطوير لتكون نقطة مرجعية في العالم الرقمي. من خلال الأنظمة عالية التنظيم وحلول الاتصالات الاستراتيجية؛ نهدف إلى إنشاء نظام بيئي يقود التكنولوجيا، ويوفر التوجيه، ويولد القيمة.",
        mission_title: "المهمة",
        mission_text: "تبسيط العمليات التكنولوجية المعقدة من خلال تقديم حلول شاملة في أمن البريد الإلكتروني، وتكامل الشهادات المتسلسلة، والأتمتة، واتصالات العلامات التجارية. في كل مشروع، نعمل بمبادئ الدقة التقنية، والاستدامة، والتركيز على المستخدم؛ مما يضمن أن المؤسسات تضع أصولها الرقمية بشكل آمن ومهني وفعال.",
        contact_title: "اتصل بنا",
        contact_text: "تواصل معنا ودعنا نناقش مشروعك.",
        contact_address: "تشكمه كوي، اسطنبول، تركيا",
        contact_phone: "هاتف: +90531-932 33 96",
        contact_email: "بريد إلكتروني: admin@mrcetin.com",
        footer_privacy: "سياسة الخصوصية",
        footer_cookies: "استخدام ملفات تعريف الارتباط",
        footer_terms: "شروط الاستخدام",
        footer_legal: "قانوني",
        footer_sitemap: "خريطة الموقع",
        footer_copyright: "© 2025 mrCetin Tech. جميع الحقوق محفوظة.",
        privacy_policy_title: "سياسة الخصوصية",
        privacy_policy_text: "توضح سياسة الخصوصية هذه كيفية قيام mrCetin Tech بجمع بياناتك الشخصية واستخدامها والكشف عنها وحمايتها. باستخدام خدماتنا، فإنك توافق على الممارسات الموضحة في هذه السياسة. أمان بياناتك مهم بالنسبة لنا، ونتخذ جميع الإجراءات اللازمة لحماية بياناتك. تُستخدم البيانات التي نجمعها لتحسين خدماتنا، وتزويدك بتجربة أفضل، والوفاء بالتزاماتنا القانونية. لا نشارك بياناتك مع أطراف ثالثة دون موافقتك، ولكن المتطلبات القانونية أو التعاون مع مزودي الخدمة لدينا قد يشكل استثناءً. لمزيد من المعلومات حول حقوق الخصوصية الخاصة بك، يرجى الاتصال بنا.",
        cookie_policy_title: "استخدام ملفات تعريف الارتباط",
        cookie_policy_text: "يستخدم موقعنا الإلكتروني ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل خدماتنا. ملفات تعريف الارتباط هي ملفات نصية صغيرة يخزنها متصفحك على جهاز الكمبيوتر الخاص بك. تساعدنا ملفات تعريف الارتباط هذه على تذكر تفضيلاتك، وتحليل حركة المرور على الموقع، وتزويدك بمحتوى مخصص. يمكنك التحكم في ملفات تعريف الارتباط وحذفها في أي وقت من خلال إعدادات المتصفح الخاص بك. ومع ذلك، يرجى ملاحظة أن بعض ميزات موقعنا الإلكتروني قد لا تعمل بشكل صحيح إذا قمت بتعطيل ملفات تعريف الارتباط. لمزيد من المعلومات، يرجى مراجعة سياسة ملفات تعريف الارتباط الخاصة بنا.",
        terms_of_use_title: "شروط الاستخدام",
        terms_of_use_text: "باستخدام موقع mrCetin Tech، فإنك توافق على شروط الاستخدام التالية. تتضمن هذه الشروط أحكامًا تتعلق باستخدام موقعنا الإلكتروني ومحتواه وحقوق الملكية الفكرية وحدود المسؤولية. المحتوى الموجود على موقعنا الإلكتروني هو لأغراض إعلامية عامة فقط ولا يشكل استشارة قانونية. يُتوقع منك عدم إساءة استخدام خدماتنا، وعدم الانخراط في أنشطة غير قانونية، واحترام حقوق المستخدمين الآخرين. في حالة انتهاك هذه الشروط، قد يتم تقييد وصولك إلى خدماتنا أو إنهاؤه. يرجى قراءة هذه الشروط بعناية.",
        legal_notice_title: "إشعار قانوني",
        legal_notice_text: "يحتوي هذا الإشعار القانوني على معلومات قانونية وتفاصيل الشركة وبيانات حقوق الطبع والنشر لـ mrCetin Tech. جميع المحتويات والنصوص والرسومات والشعارات والبرامج الموجودة على موقعنا الإلكتروني مملوكة لـ mrCetin Tech أو مرخصة لها ومحمية بموجب قوانين حقوق الطبع والنشر. يحظر الاستنساخ أو التوزيع أو الاستخدام غير المصرح به. يتم توفير المعلومات الموجودة على موقعنا الإلكتروني بحسن نية، ولكن لا يوجد ضمان لدقتها أو اكتمالها. إذا كانت لديك أي أسئلة أو مخاوف قانونية، يرجى استشارة مستشار قانوني مؤهل.",
        sitemap_title: "خريطة الموقع",
        sitemap_text: "خريطة الموقع للوصول السريع إلى جميع صفحات موقع mrCetin Tech. تتضمن الأقسام الرئيسية مثل الصفحة الرئيسية، تطبيقاتنا، من نحن، الرؤية، المهمة، اتصل بنا، سياسة الخصوصية، استخدام ملفات تعريف الارتباط، شروط الاستخدام، إشعار قانوني. تم تصميم هذه الخريطة لتسهيل التنقل في موقعنا الإلكتروني ومساعدتك في العثور على المعلومات التي تبحث عنها بسرعة أكبر. يرجى الاتصال بنا إذا كان أي رابط صفحة لا يعمل."
    },
    fr: {
        page_title: "mrCetin Tech - Conception d'applications mobiles et de jeux",
        nav_applications: "Nos applications",
        nav_about_us: "À propos de nous",
        nav_vision: "Vision",
        nav_mission: "Mission",
        nav_contact: "Contact",
        hero_title: "Expériences innovantes d'applications mobiles et de jeux",
        hero_subtitle: "Donner vie à vos rêves dans le monde numérique.",
        hero_button: "Découvrez nos projets",
        applications_title: "Nos applications",
        applications_text: "Vous trouverez ici des exemples de nos projets d'applications mobiles et de jeux.",
        game_project_1_title: "Projet de jeu 1",
        game_project_1_description: "Un jeu de formation professionnelle passionnant. En développement.",
        game_project_2_title: "Projet de jeu 2",
        game_project_2_description: "Une expérience de défi nostalgique. En développement.",
        mobile_app_project_title: "Projet d'application mobile",
        mobile_app_project_description: "Une application qui améliorera votre expérience de voyage et comblera les lacunes de votre itinéraire. Bientôt disponible.",
        status_in_development: "En développement",
        status_coming_soon: "Bientôt disponible",
        about_us_title: "Qui nous sommes",
        about_us_text_p1: "Nous sommes un studio de technologie et de communication qui fonctionne avec des principes de haute précision technique, de sécurité et de durabilité dans les processus de développement d'applications mobiles et de produits numériques.",
        about_us_text_p2: "Nous adoptons une approche qui simplifie les infrastructures complexes, optimise les processus avec l'automatisation et présente chaque étape de manière documentée.",
        about_us_text_p3: "Dans des composants critiques tels que l'architecture des applications, la sécurité des données, l'expérience utilisateur et l'infrastructure de communication ; nous développons des solutions axées à la fois sur l'ingénierie et la stratégie.",
        about_us_text_p4: "Chaque projet est conçu non seulement pour être fonctionnel, mais aussi pour être intégré à l'identité de l'entreprise, adapté au succès à long terme et techniquement durable.",
        about_us_text_p5: "Pour permettre aux marques de laisser une forte empreinte dans le monde numérique ; nous structurons professionnellement leurs infrastructures techniques et façonnons stratégiquement leurs langages de communication.",
        about_us_text_p6: "Parce que nous ne sommes pas seulement des développeurs de produits numériques ; nous sommes des partenaires de solutions qui les transportent vers l'avenir, les guident et génèrent de la valeur.",
        vision_title: "Vision",
        vision_text: "Être un point de référence dans le monde numérique en construisant des infrastructures techniques pour les institutions de manière simple, sécurisée et évolutive, avec le principe d'excellence en matière de sécurité de l'information, de durabilité du système et de communication numérique. Avec des systèmes hautement structurés et des solutions de communication stratégiques, nous visons à créer un écosystème qui guide la technologie, assure le leadership et génère de la valeur.",
        mission_title: "Mission",
        mission_text: "Simplifier les processus technologiques complexes en proposant des solutions globales en matière de sécurité de la messagerie, d'intégration de certificats en chaîne, d'automatisation et de communication de marque. Dans chaque projet, nous agissons avec les principes de précision technique, de durabilité et de centrage sur l'utilisateur, permettant aux institutions de positionner leurs actifs numériques de manière sécurisée, professionnelle et efficace.",
        contact_title: "Contact",
        contact_text: "Contactez-nous et discutons de votre projet.",
        contact_address: "Çekmeköy, Istanbul, Turquie",
        contact_phone: "Téléphone : +90531-932 33 96",
        contact_email: "E-mail : admin@mrcetin.com",
        footer_privacy: "Politique de confidentialité",
        footer_cookies: "Utilisation des cookies",
        footer_terms: "Conditions d'utilisation",
        footer_legal: "Légal",
        footer_sitemap: "Plan du site",
        footer_copyright: "© 2025 mrCetin Tech. Tous droits réservés.",
        privacy_policy_title: "Politique de confidentialité",
        privacy_policy_text: "Cette politique de confidentialité explique comment mrCetin Tech collecte, utilise, divulgue et protège vos données personnelles. En utilisant nos services, vous acceptez les pratiques décrites dans cette politique. La sécurité de vos données est importante pour nous, et nous prenons toutes les mesures nécessaires pour protéger vos données. Les données que nous collectons sont utilisées pour améliorer nos services, vous offrir une meilleure expérience et remplir nos obligations légales. Nous ne partageons pas vos données avec des tiers sans votre consentement, mais les exigences légales ou les collaborations avec nos fournisseurs de services peuvent constituer une exception. Pour plus d'informations sur vos droits en matière de confidentialité, veuillez nous contacter.",
        cookie_policy_title: "Utilisation des cookies",
        cookie_policy_text: "Notre site Web utilise des cookies pour améliorer votre expérience utilisateur et analyser nos services. Les cookies sont de petits fichiers texte stockés sur votre ordinateur par votre navigateur. Ces cookies nous aident à mémoriser vos préférences, à analyser le trafic du site et à vous fournir un contenu personnalisé. Vous pouvez contrôler et supprimer les cookies à tout moment via les paramètres de votre navigateur. Cependant, veuillez noter que certaines fonctionnalités de notre site Web могут ne pas fonctionner correctement si vous désactivez les cookies. Pour plus d'informations, veuillez consulter notre politique en matière de cookies.",
        terms_of_use_title: "Conditions d'utilisation",
        terms_of_use_text: "En utilisant le site Web de mrCetin Tech, vous acceptez les conditions d'utilisation suivantes. Ces conditions comprennent des dispositions concernant l'utilisation de notre site Web, son contenu, les droits de propriété intellectuelle et les limitations de responsabilité. Le contenu de notre site Web est uniquement à des fins d'information générale et ne constitue pas un avis juridique. Vous êtes censé ne pas abuser de nos services, ne pas vous livrer à des activités illégales et respecter les droits des autres utilisateurs. En cas de violation de ces conditions, votre accès à nos services peut être restreint ou résilié. Veuillez lire attentivement ces conditions.",
        legal_notice_title: "Mentions légales",
        legal_notice_text: "Ces mentions légales contiennent des informations juridiques, les coordonnées de l'entreprise et les déclarations de droits d'auteur de mrCetin Tech. Tout le contenu, les textes, les graphiques, les logos et les logiciels de notre site Web sont la propriété de mrCetin Tech ou sous licence et sont protégés par les lois sur le droit d'auteur. Toute reproduction, distribution ou utilisation non autorisée est interdite. Les informations sur notre site Web sont fournies de bonne foi, mais aucune garantie n'est donnée quant à leur exactitude ou leur exhaustivité. Si vous avez des questions ou des préoccupations juridiques, veuillez consulter un conseiller juridique qualifié.",
        sitemap_title: "Plan du site",
        sitemap_text: "Plan du site pour un accès rapide à toutes les pages du site Web de mrCetin Tech. Comprend les sections principales telles que l'accueil, nos applications, à propos de nous, la vision, la mission, le contact, la politique de confidentialité, l'utilisation des cookies, les conditions d'utilisation, les mentions légales. Cette carte est conçue pour faciliter votre navigation sur notre site Web et vous aider à trouver plus rapidement les informations que vous recherchez. Veuillez nous contacter si un lien de page ne fonctionne pas."
    },
    it: {
        page_title: "mrCetin Tech - Progettazione di app mobili e giochi",
        nav_applications: "Le nostre applicazioni",
        nav_about_us: "Chi siamo",
        nav_vision: "Visione",
        nav_mission: "Missione",
        nav_contact: "Contatto",
        hero_title: "Esperienze innovative di app mobili e giochi",
        hero_subtitle: "Portare i tuoi sogni nel mondo digitale.",
        hero_button: "Esplora i nostri progetti",
        applications_title: "Le nostre applicazioni",
        applications_text: "Qui troverai esempi dei nostri progetti di app mobili e giochi.",
        game_project_1_title: "Progetto di gioco 1",
        game_project_1_description: "Un entusiasmante gioco di formazione professionale. In sviluppo.",
        game_project_2_title: "Progetto di gioco 2",
        game_project_2_description: "Un'esperienza di sfida nostalgica. In sviluppo.",
        mobile_app_project_title: "Progetto di app mobile",
        mobile_app_project_description: "Un'applicazione che migliorerà la tua esperienza di viaggio e completerà le carenze del tuo percorso. Prossimamente.",
        status_in_development: "In sviluppo",
        status_coming_soon: "Prossimamente",
        about_us_title: "Chi siamo",
        about_us_text_p1: "Siamo uno studio di tecnologia e comunicazione che opera con principi di alta precisione tecnica, sicurezza e sostenibilità nei processi di sviluppo di applicazioni mobili e prodotti digitali.",
        about_us_text_p2: "Adottiamo un approccio che semplifica le infrastrutture complesse, ottimizza i processi con l'automazione e presenta ogni passaggio in modo documentato.",
        about_us_text_p3: "In componenti critici come l'architettura delle applicazioni, la sicurezza dei dati, l'esperienza dell'utente e l'infrastruttura di comunicazione; sviluppiamo soluzioni focalizzate sia sull'ingegneria che sulla strategia.",
        about_us_text_p4: "Ogni progetto è progettato non solo per essere funzionale, ma anche per essere integrato nell'identità aziendale, adatto al successo a lungo termine e tecnicamente sostenibile.",
        about_us_text_p5: "Per consentire ai marchi di lasciare un segno forte nel mondo digitale; strutturiamo professionalmente le loro infrastrutture tecniche e modelliamo strategicamente i loro linguaggi di comunicazione.",
        about_us_text_p6: "Perché non siamo solo sviluppatori di prodotti digitali; siamo partner di soluzioni che li portano nel futuro, li guidano e generano valore.",
        vision_title: "Visione",
        vision_text: "Essere un punto di riferimento nel mondo digitale costruendo infrastrutture tecniche per le istituzioni in modo semplice, sicuro e scalabile, con il principio di eccellenza nella sicurezza delle informazioni, sostenibilità del sistema e comunicazione digitale. Con sistemi altamente strutturati e soluzioni di comunicazione strategiche, miriamo a creare un ecosistema che guida la tecnologia, fornisce leadership e genera valore.",
        mission_title: "Missione",
        mission_text: "Semplificare processi tecnologici complessi offrendo soluzioni olistiche in materia di sicurezza della posta elettronica, integrazione di certificati a catena, automazione e comunicazione del marchio. In ogni progetto, agiamo con i principi di accuratezza tecnica, sostenibilità e centralità dell'utente, consentendo alle istituzioni di posizionare i propri asset digitali in modo sicuro, professionale ed efficace.",
        contact_title: "Contatto",
        contact_text: "Contattaci e parliamo del tuo progetto.",
        contact_address: "Çekmeköy, Istanbul, Turchia",
        contact_phone: "Telefono: +90531-932 33 96",
        contact_email: "E-mail: admin@mrcetin.com",
        footer_privacy: "Politica sulla privacy",
        footer_cookies: "Uso dei cookie",
        footer_terms: "Condizioni d'uso",
        footer_legal: "Legale",
        footer_sitemap: "Mappa del sito",
        footer_copyright: "© 2025 mrCetin Tech. Tutti i diritti riservati.",
        privacy_policy_title: "Politica sulla privacy",
        privacy_policy_text: "Questa politica sulla privacy spiega come mrCetin Tech raccoglie, utilizza, divulga e protegge i tuoi dati personali. Utilizzando i nostri servizi, accetti le pratiche descritte in questa politica. La sicurezza dei tuoi dati è importante per noi e adottiamo tutte le misure necessarie per proteggere i tuoi dati. I dati che raccogliamo vengono utilizzati per migliorare i nostri servizi, offrirti un'esperienza migliore e adempiere ai nostri obblighi legali. Non condividiamo i tuoi dati con terze parti senza il tuo consenso, ma i requisiti legali o le collaborazioni con i nostri fornitori di servizi possono costituire un'eccezione. Per ulteriori informazioni sui tuoi diritti sulla privacy, ti preghiamo di contattarci.",
        cookie_policy_title: "Uso dei cookie",
        cookie_policy_text: "Il nostro sito Web utilizza i cookie per migliorare la tua esperienza utente e analizzare i nostri servizi. I cookie sono piccoli file di testo memorizzati sul tuo computer dal tuo browser. Questi cookie ci aiutano a ricordare le tue preferenze, analizzare il traffico del sito e fornirti contenuti personalizzati. Puoi controllare ed eliminare i cookie in qualsiasi momento tramite le impostazioni del tuo browser. Tuttavia, tieni presente che alcune funzionalità del nostro sito Web potrebbero non funzionare correttamente se disabiliti i cookie. Per ulteriori informazioni, consulta la nostra politica sui cookie.",
        terms_of_use_title: "Condizioni d'uso",
        terms_of_use_text: "Utilizzando il sito Web di mrCetin Tech, accetti i seguenti termini di utilizzo. Questi termini includono disposizioni relative all'uso del nostro sito Web, al suo contenuto, ai diritti di proprietà intellettuale e alle limitazioni di responsabilità. Il contenuto del nostro sito Web è solo a scopo informativo generale e non costituisce consulenza legale. Ci si aspetta che tu non abusi dei nostri servizi, non intraprenda attività illegali e rispetti i diritti degli altri utenti. In caso di violazione di questi termini, il tuo accesso ai nostri servizi potrebbe essere limitato o interrotto. Si prega di leggere attentamente questi termini.",
        legal_notice_title: "Avviso legale",
        legal_notice_text: "Questo avviso legale contiene informazioni legali, dettagli aziendali e dichiarazioni di copyright di mrCetin Tech. Tutti i contenuti, testi, grafici, loghi e software sul nostro sito Web sono di proprietà o concessi in licenza a mrCetin Tech e sono protetti dalle leggi sul copyright. È vietata la riproduzione, la distribuzione o l'uso non autorizzati. Le informazioni sul nostro sito Web sono fornite in buona fede, ma non viene fornita alcuna garanzia sulla loro accuratezza o completezza. In caso di domande o dubbi legali, consultare un consulente legale qualificato.",
        sitemap_title: "Mappa del sito",
        sitemap_text: "Mappa del sito per un rapido accesso a tutte le pagine del sito Web di mrCetin Tech. Include sezioni principali come Home, Le nostre applicazioni, Chi siamo, Visione, Missione, Contatto, Politica sulla privacy, Uso dei cookie, Condizioni d'uso, Avviso legale. Questa mappa è progettata per facilitare la navigazione nel nostro sito Web e aiutarti a trovare più rapidamente le informazioni che stai cercando. Ti preghiamo di contattarci se un collegamento a una pagina non funziona."
    }
};

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'TITLE') {
                document.title = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    // Update the lang attribute of the html tag
    document.documentElement.lang = lang;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Sayfayı kaydırmayı engelle
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Sayfayı kaydırmayı tekrar etkinleştir
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Website loaded successfully!');

    // Set default language on load (e.g., from browser or saved preference)
    const defaultLang = localStorage.getItem('selectedLanguage') || 'tr';
    const languageSelect = document.getElementById('language-select');
    const mobileLanguageSelect = document.getElementById('mobile-language-select');

    function initializeLanguageSelect(selectElement, initialLang) {
        if (selectElement) {
            selectElement.value = initialLang;
            selectElement.addEventListener('change', (event) => {
                const selectedLanguage = event.target.value;
                localStorage.setItem('selectedLanguage', selectedLanguage);
                setLanguage(selectedLanguage);
            });
        }
    }

    initializeLanguageSelect(languageSelect, defaultLang);
    initializeLanguageSelect(mobileLanguageSelect, defaultLang);
    setLanguage(defaultLang); // Sayfa yüklendiğinde varsayılan dili ayarla

    // Function to adjust hero-section margin-top based on header height
    function adjustHeroSectionMargin() {
        const header = document.querySelector('header');
        const heroSection = document.querySelector('.hero-section');
        if (header && heroSection) {
            heroSection.style.marginTop = header.offsetHeight + 'px';
        }
    }

    // Adjust margin on load and resize
    adjustHeroSectionMargin();
    window.addEventListener('resize', adjustHeroSectionMargin);

    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null; // Handle null case

    if (mobileMenuToggle && mobileMenu && mobileMenuIcon) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-open');
            if (mobileMenu.classList.contains('is-open')) {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-open');
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
    }

    // Example: Add a class to header on scroll for styling changes
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll-triggered animations using Intersection Observer
    const sections = document.querySelectorAll('.section, .hero-section');

            const observerOptions = {
                root: null, // viewport
                rootMargin: '0px',
                threshold: 0.1 // %10'u görünür olduğunda tetikle
            };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Modal functionality
    document.querySelectorAll('.modal-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('href').substring(1); // # işaretini kaldır
            openModal(modalId);
        });
    });

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            closeModal(modalId);
        });
    });

    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // More advanced animations will be added here later
    // For example, using GSAP for more complex timeline-based animations.

    // Theme Switcher Logic
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const htmlEl = document.documentElement;

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        themeToggle.checked = newTheme === 'dark';
        mobileThemeToggle.checked = newTheme === 'dark';
    }

    themeToggle.addEventListener('change', toggleTheme);
    mobileThemeToggle.addEventListener('change', toggleTheme);

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    mobileThemeToggle.checked = savedTheme === 'dark';
});
