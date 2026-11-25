import { BookingStatus, EquipmentCategory, Language, PriceUnit } from '../types';

export interface TranslationBundle {
  brand: string;
  tagline: string;
  nav: {
    home: string;
    marketplace: string;
    bookings: string;
    ownerHub: string;
    profile: string;
    support: string;
    signIn: string;
    dashboard: string;
  };
  hero: {
    headline: string;
    subheading: string;
    locationPlaceholder: string;
    equipmentPlaceholder: string;
    dateLabel: string;
    searchBtn: string;
    rentCta: string;
    listCta: string;
    trust1: string;
    trust2: string;
    trust3: string;
  };
  sections: {
    popularCategories: string;
    featuredEquipment: string;
    viewAllMarketplace: string;
    howItWorks: string;
    benefitsTitle: string;
    forOwnersTitle: string;
    forOwnersSub: string;
    forOwnersList1: string;
    forOwnersList2: string;
    forOwnersList3: string;
    testimonialsTitle: string;
    demoLabel: string;
  };
  steps: {
    s1Title: string;
    s1Desc: string;
    s2Title: string;
    s2Desc: string;
    s3Title: string;
    s3Desc: string;
    s4Title: string;
    s4Desc: string;
  };
  benefits: {
    b1Title: string;
    b1Desc: string;
    b2Title: string;
    b2Desc: string;
    b3Title: string;
    b3Desc: string;
    b4Title: string;
    b4Desc: string;
  };
  categories: Record<EquipmentCategory, string>;
  units: Record<PriceUnit, string>;
  statuses: Record<BookingStatus, string>;
  common: {
    all: string;
    available: string;
    unavailable: string;
    verifiedOwner: string;
    unverifiedOwner: string;
    viewDetails: string;
    bookNow: string;
    callOwner: string;
    whatsappOwner: string;
    contactOwner: string;
    kmAway: string;
    per: string;
    reviews: string;
    noReviews: string;
    loading: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    confirm: string;
    back: string;
    close: string;
    submit: string;
    demoTag: string;
    operatorIncluded: string;
    deliveryAvailable: string;
  };
  dashboard: {
    welcome: string;
    selectedLocation: string;
    changeLocation: string;
    useGps: string;
    gpsExplainTitle: string;
    gpsExplainBody: string;
    allowGps: string;
    nearbyMachines: string;
    recommended: string;
    recentListings: string;
    upcomingBookings: string;
    quickSupport: string;
    supportDesc: string;
    callHelpline: string;
    noBookings: string;
  };
  marketplace: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filters: string;
    resetFilters: string;
    category: string;
    locationFilter: string;
    maxDistance: string;
    maxPrice: string;
    priceUnit: string;
    availableDate: string;
    minRating: string;
    sortBy: string;
    sortNearest: string;
    sortLowestPrice: string;
    sortHighestRated: string;
    sortRecent: string;
    listView: string;
    mapView: string;
    mapNotice: string;
    noResults: string;
    resultsCount: string;
    allDistricts: string;
    allTalukas: string;
    allVillages: string;
    districtLabel: string;
    talukaLabel: string;
    villageLabel: string;
    searchLocationPlaceholder: string;
    onlyAvailable: string;
    withOperator: string;
    withDelivery: string;
    coverageBanner: string;
  };
  details: {
    specifications: string;
    rentalConditions: string;
    availableDates: string;
    locationMap: string;
    ownerInfo: string;
    relatedEquipment: string;
    customerReviews: string;
    ratingBreakdown: string;
    noPhoneNote: string;
  };
  booking: {
    requestBooking: string;
    selectDate: string;
    startTime: string;
    duration: string;
    acresLabel: string;
    farmLocation: string;
    farmLocationPlaceholder: string;
    deliveryRequired: string;
    deliveryYes: string;
    deliveryNo: string;
    notes: string;
    notesPlaceholder: string;
    costSummary: string;
    baseRental: string;
    deliveryCharge: string;
    operatorCharge: string;
    totalEstimate: string;
    submitRequest: string;
    pendingNote: string;
    confirmedTitle: string;
    confirmedBody: string;
    myBookings: string;
    upcoming: string;
    history: string;
    cancelBooking: string;
    cancelPolicy: string;
    writeReview: string;
    yourRating: string;
    yourReview: string;
    submitReview: string;
    reviewSubmitted: string;
    signInToBook: string;
  };
  owner: {
    title: string;
    subtitle: string;
    totalListings: string;
    activeEquipment: string;
    pendingRequests: string;
    confirmedBookings: string;
    completedBookings: string;
    monthlyEarnings: string;
    recentActivity: string;
    addEquipment: string;
    editEquipment: string;
    myEquipment: string;
    bookingRequests: string;
    accept: string;
    reject: string;
    markCompleted: string;
    customerInfo: string;
    toggleActive: string;
    enableOwnerRole: string;
    enableOwnerDesc: string;
    noListings: string;
    noRequests: string;
  };
  form: {
    category: string;
    title: string;
    titlePlaceholder: string;
    brand: string;
    model: string;
    description: string;
    price: string;
    priceUnit: string;
    village: string;
    taluka: string;
    district: string;
    state: string;
    hubPreset: string;
    availableDates: string;
    horsepower: string;
    fuelType: string;
    workingWidth: string;
    year: string;
    deliveryCharge: string;
    operatorAvailable: string;
    operatorCharge: string;
    rentalConditions: string;
    contactPhone: string;
    photos: string;
    addPhotoUrl: string;
    uploadPhoto: string;
    publishEquipment: string;
    updateEquipment: string;
    successPublished: string;
  };
  auth: {
    title: string;
    demoBanner: string;
    tabDemo: string;
    tabEmail: string;
    tabPhone: string;
    tabForgot: string;
    quickFarmer: string;
    quickOwner: string;
    quickBoth: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    phoneLabel: string;
    otpLabel: string;
    sendOtp: string;
    verifyOtp: string;
    demoOtpHint: string;
    signInBtn: string;
    signUpBtn: string;
    createAccountToggle: string;
    haveAccountToggle: string;
    forgotPasswordBtn: string;
    resetPasswordBtn: string;
    logout: string;
    profileTitle: string;
    roleFarmer: string;
    roleOwner: string;
    languagePref: string;
    notifications: string;
    markAllRead: string;
  };
  footer: {
    about: string;
    contact: string;
    terms: string;
    privacy: string;
    help: string;
    language: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  mr: {
    brand: 'FarmRent',
    tagline: 'तुमच्या जवळची शेतीची यंत्रे भाड्याने घ्या.',
    nav: {
      home: 'मुख्यपृष्ठ',
      marketplace: 'यंत्र बाजार',
      bookings: 'बुकिंग',
      ownerHub: 'मालक डॅशबोर्ड',
      profile: 'प्रोफाइल',
      support: 'मदत',
      signIn: 'लॉगिन करा',
      dashboard: 'शेतकरी डॅशबोर्ड',
    },
    hero: {
      headline: 'शेतीची मशीन आता तुमच्या जवळ!',
      subheading:
        'तुमच्या गावातील आणि तालुक्यातील ट्रॅक्टर, रोटाव्हेटर, हार्वेस्टर, स्प्रेअर व इतर शेतीची यंत्रे योग्य दरात थेट मालकाकडून भाड्याने घ्या.',
      locationPlaceholder: 'गाव, तालुका किंवा जिल्हा निवडा',
      equipmentPlaceholder: 'कोणते यंत्र हवे आहे? (ट्रॅक्टर, रोटाव्हेटर...)',
      dateLabel: 'तारीख',
      searchBtn: 'यंत्र शोधा',
      rentCta: 'यंत्र भाड्याने घ्या',
      listCta: 'तुमचे यंत्र नोंदवा',
      trust1: 'थेट मालकांशी संपर्क',
      trust2: 'तास, दिवस व एकर नुसार पारदर्शक दर',
      trust3: 'मराठी, हिंदी आणि इंग्रजी सोय',
    },
    sections: {
      popularCategories: 'लोकप्रिय शेती यंत्र प्रकार',
      featuredEquipment: 'जवळपासची प्रमुख यंत्रे',
      viewAllMarketplace: 'सर्व यंत्रे पहा',
      howItWorks: 'FarmRent कसे काम करते?',
      benefitsTitle: 'शेतकऱ्यांसाठी खास फायदे',
      forOwnersTitle: 'यंत्र मालकांसाठी जादा उत्पन्नाची संधी',
      forOwnersSub:
        'तुमचा ट्रॅक्टर, हार्वेस्टर किंवा इतर अवजारे रिकाम्या वेळेत भाड्याने देऊन महिन्याचे उत्पन्न वाढवा.',
      forOwnersList1: 'मोफत यंत्र नोंदणी आणि स्वतःचे दर ठरवण्याची मुभा',
      forOwnersList2: 'बुकिंग विनंती स्वीकारणे किंवा नाकारणे पूर्णपणे तुमच्या हातात',
      forOwnersList3: 'शेतकऱ्यांशी थेट फोन व WhatsApp वर संपर्क',
      testimonialsTitle: 'शेतकरी आणि यंत्र मालकांचे अनुभव',
      demoLabel: 'नमुना (Demo)',
    },
    steps: {
      s1Title: '१. यंत्र शोधा',
      s1Desc: 'तुमचे गाव आणि कामाची गरज निवडून जवळचे यंत्र पहा.',
      s2Title: '२. तारीख व वेळ निवडा',
      s2Desc: 'कोणत्या दिवशी, किती तास किंवा एकर काम आहे ते भरा.',
      s3Title: '३. बुकिंग विनंती पाठवा',
      s3Desc: 'अंदाजे खर्च पाहून यंत्र मालकाला बुकिंगची विनंती पाठवा.',
      s4Title: '४. मंजुरी व काम पूर्ण',
      s4Desc: 'मालकाने बुकिंग स्वीकारल्यावर वेळेवर शेतात काम करून घ्या.',
    },
    benefits: {
      b1Title: 'पैशांची बचत',
      b1Desc: 'मोठी यंत्रे विकत न घेता गरजेनुसार परवडणाऱ्या दरात भाड्याने मिळवा.',
      b2Title: 'जवळचे यंत्र लगेच मिळावे',
      b2Desc: 'तुमच्या गावापासून अंतर पाहून जवळचा ट्रॅक्टर त्वरित बुक करा.',
      b3Title: 'मालकाशी थेट संवाद',
      b3Desc: 'कोणताही मध्यस्थ नाही — थेट कॉल किंवा WhatsApp वर बोला.',
      b4Title: 'सोपे आणि जलद बुकिंग',
      b4Desc: 'तास, दिवस, एकर किंवा फेरीनुसार स्पष्ट दर आणि अर्जाची स्थिती पहा.',
    },
    categories: {
      tractor: 'ट्रॅक्टर',
      rotavator: 'रोटाव्हेटर',
      harvester: 'हार्वेस्टर',
      cultivator: 'कल्टिव्हेटर',
      seed_drill: 'सीड ड्रिल (पेरणी यंत्र)',
      sprayer: 'फवारणी यंत्र (स्प्रेअर)',
      thresher: 'थ्रेशर (मळणी यंत्र)',
      trailer: 'ट्रॉली / ट्रेलर',
      plough: 'नांगर (MB Plough)',
      jcb: 'जेसीबी (JCB)',
      transport: 'शेती मालवाहतूक',
      other: 'इतर शेती यंत्रे',
    },
    units: {
      hour: 'तास',
      day: 'दिवस',
      acre: 'एकर',
      trip: 'फेरी',
    },
    statuses: {
      pending: 'प्रलंबित (मंजुरी बाकी)',
      accepted: 'मंजूर (Accepted)',
      rejected: 'नाकारले',
      cancelled: 'रद्द केले',
      completed: 'काम पूर्ण',
    },
    common: {
      all: 'सर्व',
      available: 'उपलब्ध',
      unavailable: 'सध्या उपलब्ध नाही',
      verifiedOwner: 'पडताळणी पूर्ण मालक',
      unverifiedOwner: 'पडताळणी प्रलंबित',
      viewDetails: 'माहिती पहा',
      bookNow: 'आता बुक करा',
      callOwner: 'कॉल करा',
      whatsappOwner: 'WhatsApp करा',
      contactOwner: 'मालकाशी संपर्क',
      kmAway: 'किमी अंतरावर',
      per: 'प्रति',
      reviews: 'अभिप्राय',
      noReviews: 'अद्याप कोणतेही अभिप्राय नाहीत.',
      loading: 'माहिती लोड होत आहे...',
      save: 'जतन करा',
      cancel: 'रद्द करा',
      edit: 'बदला',
      delete: 'काढून टाका',
      confirm: 'खात्री करा',
      back: 'मागे जा',
      close: 'बंद करा',
      submit: 'पाठवा',
      demoTag: 'नमुना माहिती',
      operatorIncluded: 'ड्रायव्हरसह उपलब्ध',
      deliveryAvailable: 'शेतापर्यंत पोहोच सोय',
    },
    dashboard: {
      welcome: 'नमस्कार',
      selectedLocation: 'निवडलेले ठिकाण',
      changeLocation: 'ठिकाण बदला',
      useGps: 'GPS वापरा',
      gpsExplainTitle: 'तुमच्या जवळची यंत्रे शोधण्यासाठी लोकेशन परवानगी',
      gpsExplainBody:
        'तुमच्या शेतापासून किती किमी अंतरावर ट्रॅक्टर व इतर अवजारे उपलब्ध आहेत हे दाखवण्यासाठी आम्हाला तुमच्या लोकेशनची आवश्यकता आहे.',
      allowGps: 'लोकेशन परवानगी द्या',
      nearbyMachines: 'तुमच्या जवळची यंत्रे',
      recommended: 'तुमच्या भागासाठी शिफारस केलेली यंत्रे',
      recentListings: 'नवीन जोडलेली यंत्रे',
      upcomingBookings: 'तुमची आगामी बुकिंग्ज',
      quickSupport: 'शेतकरी मदत केंद्र',
      supportDesc: 'बुकिंग किंवा यंत्र वापराबाबत अडचण असल्यास आमच्याशी संपर्क साधा.',
      callHelpline: 'मदत केंद्राशी संपर्क',
      noBookings: 'तुम्ही अद्याप कोणतेही बुकिंग केलेले नाही.',
    },
    marketplace: {
      title: 'शेती यंत्र बाजार',
      subtitle: 'तुमच्या जिल्ह्यातील व तालुक्यातील उपलब्ध सर्व शेतीची अवजारे पहा.',
      searchPlaceholder: 'ट्रॅक्टर, रोटाव्हेटर, गाव किंवा ब्रँड शोधा...',
      filters: 'फिल्टर',
      resetFilters: 'फिल्टर काढा',
      category: 'यंत्र प्रकार',
      locationFilter: 'जिल्हा / तालुका',
      maxDistance: 'कमाल अंतर (किमी)',
      maxPrice: 'कमाल दर (₹)',
      priceUnit: 'दर पद्धत',
      availableDate: 'उपलब्ध तारीख',
      minRating: 'किमान रेटिंग',
      sortBy: 'क्रमवारी',
      sortNearest: 'सर्वात जवळ',
      sortLowestPrice: 'कमी दर प्रथम',
      sortHighestRated: 'उत्कृष्ट रेटिंग',
      sortRecent: 'नवीन यादी',
      listView: 'यादी पहा',
      mapView: 'नकाशा पहा',
      mapNotice:
        'महाराष्ट्र तालुका नकाशा मोड सुरू आहे (सध्या थेट Google Maps API की जोडलेली नाही; खालील नकाशावर क्लिक करून जवळचे यंत्र पहा).',
      noResults: 'निवडलेल्या फिल्टरनुसार कोणतेही यंत्र सापडले नाही.',
      resultsCount: 'यंत्रे उपलब्ध',
      allDistricts: 'सर्व ३६ जिल्हे',
      allTalukas: 'सर्व तालुके',
      allVillages: 'सर्व गावे',
      districtLabel: 'जिल्हा',
      talukaLabel: 'तालुका',
      villageLabel: 'गाव',
      searchLocationPlaceholder: 'महाराष्ट्रातील कोणतेही गाव, तालुका किंवा जिल्हा शोधा...',
      onlyAvailable: 'फक्त उपलब्ध यंत्रे',
      withOperator: 'ड्रायव्हरसह',
      withDelivery: 'शेतावर पोहोच सोय',
      coverageBanner: 'महाराष्ट्र ३६ जिल्हे · ३५८ तालुके · गाव शोध सुविधा',
    },
    details: {
      specifications: 'यंत्राची तांत्रिक माहिती',
      rentalConditions: 'भाड्याच्या अटी व नियम',
      availableDates: 'उपलब्ध तारखा',
      locationMap: 'ठिकाण आणि अंतर',
      ownerInfo: 'यंत्र मालकाची माहिती',
      relatedEquipment: 'इतर संबंधित यंत्रे',
      customerReviews: 'शेतकऱ्यांचे अभिप्राय व रेटिंग',
      ratingBreakdown: 'एकूण गुण',
      noPhoneNote: 'मालकाचा फोन नंबर बुकिंगनंतर किंवा संपर्क बटनाद्वारे उपलब्ध होईल.',
    },
    booking: {
      requestBooking: 'बुकिंग विनंती पाठवा',
      selectDate: 'कामाची तारीख',
      startTime: 'सुरुवातीची वेळ',
      duration: 'कालावधी',
      acresLabel: 'क्षेत्रफळ (एकर)',
      farmLocation: 'शेताचा पत्ता / गट नंबर / गाव',
      farmLocationPlaceholder: 'उदा. माळेगाव बु. शिवार, पाण्याच्या टाकीजवळ',
      deliveryRequired: 'यंत्र शेतापर्यंत पोहोच हवे का?',
      deliveryYes: 'होय, शेतावर पोहोच हवे',
      deliveryNo: 'नाही, मी स्वतः नेईन',
      notes: 'कामाबद्दल अधिक माहिती (ऐच्छिक)',
      notesPlaceholder: 'उदा. ऊस लावणीसाठी जमीन भुसभुशीत करायची आहे',
      costSummary: 'अंदाजे खर्चाचा तपशील',
      baseRental: 'मूळ भाडे',
      deliveryCharge: 'पोहोच शुल्क',
      operatorCharge: 'ड्रायव्हर / ऑपरेटर शुल्क',
      totalEstimate: 'एकूण अंदाजे रक्कम',
      submitRequest: 'बुकिंग विनंती पाठवा',
      pendingNote:
        'टीप: मालकाने तुमची विनंती स्वीकारल्यानंतरच बुकिंग निश्चित (Confirm) मानले जाईल.',
      confirmedTitle: 'तुमची बुकिंग विनंती पाठवली आहे!',
      confirmedBody:
        'यंत्र मालकाला सूचना गेली आहे. ते स्वीकारताच तुम्हाला बुकिंग विभागात अपडेट दिसेल.',
      myBookings: 'माझी बुकिंग्ज',
      upcoming: 'आगामी व चालू',
      history: 'मागील इतिहास',
      cancelBooking: 'बुकिंग रद्द करा',
      cancelPolicy: 'कामाच्या तारखेपूर्वी बुकिंग रद्द करता येते.',
      writeReview: 'अभिप्राय व रेटिंग द्या',
      yourRating: 'तुमचे रेटिंग (१ ते ५ तारे)',
      yourReview: 'यंत्र आणि मालकाबद्दल अनुभव लिहा',
      submitReview: 'अभिप्राय जतन करा',
      reviewSubmitted: 'अभिप्राय नोंदवला',
      signInToBook: 'बुकिंग करण्यासाठी कृपया लॉगिन करा',
    },
    owner: {
      title: 'यंत्र मालक डॅशबोर्ड',
      subtitle: 'तुमची यंत्रे, येणाऱ्या बुकिंग विनंत्या आणि मासिक कमाई व्यवस्थापित करा.',
      totalListings: 'एकूण नोंदवलेली यंत्रे',
      activeEquipment: 'सक्रिय यंत्रे',
      pendingRequests: 'प्रलंबित विनंत्या',
      confirmedBookings: 'मंजूर बुकिंग्ज',
      completedBookings: 'पूर्ण झालेली कामे',
      monthlyEarnings: 'या महिन्याची कमाई',
      recentActivity: 'अलीकडील घडामोडी',
      addEquipment: 'नवीन यंत्र जोडा',
      editEquipment: 'यंत्र माहिती बदला',
      myEquipment: 'माझी यंत्रे',
      bookingRequests: 'बुकिंग विनंत्या',
      accept: 'स्वीकारा',
      reject: 'नाकारा',
      markCompleted: 'काम पूर्ण झाले',
      customerInfo: 'शेतकऱ्याची माहिती',
      toggleActive: 'उपलब्धता बदला',
      enableOwnerRole: 'यंत्र मालक खाते सुरू करा',
      enableOwnerDesc:
        'तुमच्याकडे ट्रॅक्टर किंवा शेतीची अवजारे असल्यास ती भाड्याने देण्यासाठी मालक विभाग सुरू करा.',
      noListings: 'तुम्ही अद्याप कोणतेही यंत्र जोडलेले नाही.',
      noRequests: 'सध्या कोणतीही नवीन बुकिंग विनंती नाही.',
    },
    form: {
      category: 'यंत्राचा प्रकार',
      title: 'यंत्राचे नाव',
      titlePlaceholder: 'उदा. महिंद्रा अर्जुन नोवो ६०५ ट्रॅक्टर',
      brand: 'कंपनी (Brand)',
      model: 'मॉडेल',
      description: 'यंत्राबद्दल सविस्तर माहिती',
      price: 'भाड्याचा दर (₹)',
      priceUnit: 'दर आकारणी पद्धत',
      village: 'गाव',
      taluka: 'तालुका',
      district: 'जिल्हा',
      state: 'राज्य',
      hubPreset: 'जवळचे केंद्र निवडा (अचूक अंतरासाठी)',
      availableDates: 'उपलब्ध तारखा (स्वल्पविराम देऊन)',
      horsepower: 'क्षमता / HP',
      fuelType: 'इंधन प्रकार',
      workingWidth: 'कामाची रुंदी / क्षमता',
      year: 'खरेदी वर्ष',
      deliveryCharge: 'पोहोच शुल्क (₹, नसल्यास 0)',
      operatorAvailable: 'ड्रायव्हर / ऑपरेटर सोबत आहे का?',
      operatorCharge: 'ऑपरेटर शुल्क (₹)',
      rentalConditions: 'भाड्याच्या अटी (उदा. डिझेल कोणाचे)',
      contactPhone: 'संपर्क मोबाईल नंबर (कॉल व WhatsApp साठी)',
      photos: 'यंत्राचे फोटो',
      addPhotoUrl: 'फोटो लिंक जोडा किंवा खालील गॅलरीतून निवडा',
      uploadPhoto: 'फोटो अपलोड करा',
      publishEquipment: 'यंत्र बाजारपेठेत प्रसिद्ध करा',
      updateEquipment: 'बदल जतन करा',
      successPublished: 'तुमचे यंत्र यशस्वीरित्या नोंदवले गेले!',
    },
    auth: {
      title: 'FarmRent खाते लॉगिन / नोंदणी',
      demoBanner:
        'प्रिव्ह्यू डेमो ऑथ मोड: थेट SMS OTP आणि Firebase सर्व्हर जोडलेला नसल्याने चाचणीसाठी डेमो लॉगिन किंवा ईमेल/पासवर्ड वापरा.',
      tabDemo: 'जलद डेमो लॉगिन',
      tabEmail: 'ईमेल लॉगिन',
      tabPhone: 'मोबाईल OTP (डेमो)',
      tabForgot: 'पासवर्ड रीसेट',
      quickFarmer: 'शेतकरी म्हणून पहा (रमेश पाटील - बारामती)',
      quickOwner: 'यंत्र मालक म्हणून पहा (सुरेश देशमुख - निफाड)',
      quickBoth: 'शेतकरी + मालक दोन्ही (नवीन खाते)',
      nameLabel: 'पूर्ण नाव',
      emailLabel: 'ईमेल पत्ता',
      passwordLabel: 'पासवर्ड',
      phoneLabel: 'मोबाईल नंबर (+91)',
      otpLabel: '६ अंकी OTP कोड',
      sendOtp: 'डेमो OTP मिळवा',
      verifyOtp: 'OTP तपासा व लॉगिन करा',
      demoOtpHint: 'डेमो प्रिव्ह्यू OTP कोड:',
      signInBtn: 'लॉगिन करा',
      signUpBtn: 'नवीन खाते तयार करा',
      createAccountToggle: 'नवीन आहात? खाते तयार करा',
      haveAccountToggle: 'आधीच खाते आहे? लॉगिन करा',
      forgotPasswordBtn: 'पासवर्ड विसरलात का?',
      resetPasswordBtn: 'पासवर्ड रीसेट करा',
      logout: 'बाहेर पडा (Logout)',
      profileTitle: 'माझे प्रोफाइल व सेटिंग्ज',
      roleFarmer: 'शेतकरी (यंत्र भाड्याने घेणारे)',
      roleOwner: 'यंत्र मालक (भाड्याने देणारे)',
      languagePref: 'पसंतीची भाषा',
      notifications: 'सूचना (Notifications)',
      markAllRead: 'सर्व वाचले म्हणून खूण करा',
    },
    footer: {
      about: 'आमच्याविषयी',
      contact: 'संपर्क',
      terms: 'अटी व शर्ती',
      privacy: 'गोपनीयता धोरण',
      help: 'शेतकरी मदत',
      language: 'भाषा',
      copyright: '© २०२६ FarmRent महाराष्ट्र. शेतकऱ्यांच्या प्रगतीसाठी.',
    },
  },
  hi: {
    brand: 'FarmRent',
    tagline: 'अपने पास की खेती की मशीनें किराए पर लें।',
    nav: {
      home: 'होम',
      marketplace: 'मशीन बाजार',
      bookings: 'बुकिंग',
      ownerHub: 'मालिक डैशबोर्ड',
      profile: 'प्रोफाइल',
      support: 'सहायता',
      signIn: 'लॉगिन करें',
      dashboard: 'किसान डैशबोर्ड',
    },
    hero: {
      headline: 'खेती की मशीन अब आपके पास!',
      subheading:
        'अपने गांव और तहसील के पास ट्रैक्टर, रोटावेटर, हार्वेस्टर, स्प्रेयर और अन्य कृषि यंत्र सही किराए पर सीधे मालिक से बुक करें।',
      locationPlaceholder: 'गांव, तहसील या जिला चुनें',
      equipmentPlaceholder: 'कौन सी मशीन चाहिए? (ट्रैक्टर, रोटावेटर...)',
      dateLabel: 'तारीख',
      searchBtn: 'मशीन खोजें',
      rentCta: 'मशीन किराए पर लें',
      listCta: 'अपनी मशीन जोड़ें',
      trust1: 'सीधा मालिक से संपर्क',
      trust2: 'घंटे, दिन और एकड़ के अनुसार साफ किराया',
      trust3: 'मराठी, हिंदी और अंग्रेजी सुविधा',
    },
    sections: {
      popularCategories: 'लोकप्रिय कृषि मशीन श्रेणियां',
      featuredEquipment: 'पास की प्रमुख मशीनें',
      viewAllMarketplace: 'सभी मशीनें देखें',
      howItWorks: 'FarmRent कैसे काम करता है?',
      benefitsTitle: 'किसानों के लिए मुख्य लाभ',
      forOwnersTitle: 'मशीन मालिकों के लिए अतिरिक्त आय',
      forOwnersSub:
        'खाली समय में अपना ट्रैक्टर, हार्वेस्टर या कृषि उपकरण किराए पर देकर मासिक कमाई बढ़ाएं।',
      forOwnersList1: 'मुफ्त मशीन लिस्टिंग और अपना किराया तय करने की आजादी',
      forOwnersList2: 'बुकिंग अनुरोध स्वीकार या अस्वीकार करने का पूरा नियंत्रण',
      forOwnersList3: 'किसानों से सीधा फोन और WhatsApp संपर्क',
      testimonialsTitle: 'किसानों और मशीन मालिकों के अनुभव',
      demoLabel: 'नमूना (Demo)',
    },
    steps: {
      s1Title: '1. मशीन खोजें',
      s1Desc: 'अपना गांव और जरूरत चुनकर नजदीकी मशीन देखें।',
      s2Title: '2. तारीख और समय चुनें',
      s2Desc: 'किस दिन और कितने घंटे या एकड़ काम है यह भरें।',
      s3Title: '3. बुकिंग अनुरोध भेजें',
      s3Desc: 'अनुमानित किराया देखकर मशीन मालिक को अनुरोध भेजें।',
      s4Title: '4. मंजूरी और काम पूरा',
      s4Desc: 'मालिक की मंजूरी मिलने पर समय पर खेत का काम करवाएं।',
    },
    benefits: {
      b1Title: 'पैसे की बचत',
      b1Desc: 'महंगी मशीन खरीदने की बजाय जरूरत के अनुसार कम किराए पर लें।',
      b2Title: 'पास में तुरंत मशीन',
      b2Desc: 'अपने गांव से दूरी देखकर नजदीकी ट्रैक्टर तुरंत बुक करें।',
      b3Title: 'मालिक से सीधी बात',
      b3Desc: 'कोई बिचौलिया नहीं — सीधा कॉल या WhatsApp से संपर्क करें।',
      b4Title: 'आसान और तेज बुकिंग',
      b4Desc: 'घंटे, दिन, एकड़ या चक्कर के अनुसार साफ दरें और लाइव स्टेटस।',
    },
    categories: {
      tractor: 'ट्रैक्टर',
      rotavator: 'रोटावेटर',
      harvester: 'हार्वेस्टर',
      cultivator: 'कल्टीवेटर',
      seed_drill: 'सीड ड्रिल (बुवाई मशीन)',
      sprayer: 'स्प्रेयर (छिड़काव मशीन)',
      thresher: 'थ्रेशर',
      trailer: 'ट्रॉली / ट्रेलर',
      plough: 'हल (MB Plough)',
      jcb: 'जेसीबी (JCB)',
      transport: 'कृषि माल परिवहन',
      other: 'अन्य कृषि मशीनें',
    },
    units: {
      hour: 'घंटा',
      day: 'दिन',
      acre: 'एकड़',
      trip: 'चक्कर',
    },
    statuses: {
      pending: 'लंबित (मंजूरी बाकी)',
      accepted: 'स्वीकृत (Accepted)',
      rejected: 'अस्वीकृत',
      cancelled: 'रद्द',
      completed: 'काम पूरा',
    },
    common: {
      all: 'सभी',
      available: 'उपलब्ध',
      unavailable: 'अभी उपलब्ध नहीं',
      verifiedOwner: 'सत्यापित मालिक',
      unverifiedOwner: 'सत्यापन बाकी',
      viewDetails: 'विवरण देखें',
      bookNow: 'अभी बुक करें',
      callOwner: 'कॉल करें',
      whatsappOwner: 'WhatsApp करें',
      contactOwner: 'मालिक से संपर्क',
      kmAway: 'किमी दूर',
      per: 'प्रति',
      reviews: 'समीक्षाएं',
      noReviews: 'अभी कोई समीक्षा नहीं है।',
      loading: 'लोड हो रहा है...',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      edit: 'बदलें',
      delete: 'हटाएं',
      confirm: 'पुष्टि करें',
      back: 'वापस जाएं',
      close: 'बंद करें',
      submit: 'भेजें',
      demoTag: 'डेमो डेटा',
      operatorIncluded: 'ड्राइवर सहित',
      deliveryAvailable: 'खेत तक डिलीवरी',
    },
    dashboard: {
      welcome: 'नमस्ते',
      selectedLocation: 'चुना गया स्थान',
      changeLocation: 'स्थान बदलें',
      useGps: 'GPS उपयोग करें',
      gpsExplainTitle: 'पास की मशीनें खोजने के लिए लोकेशन अनुमति',
      gpsExplainBody:
        'आपके खेत से ट्रैक्टर और मशीनों की सही दूरी दिखाने के लिए हमें आपकी लोकेशन की आवश्यकता है।',
      allowGps: 'लोकेशन अनुमति दें',
      nearbyMachines: 'आपके पास की मशीनें',
      recommended: 'आपके क्षेत्र के लिए अनुशंसित',
      recentListings: 'नई जोड़ी गई मशीनें',
      upcomingBookings: 'आपकी आगामी बुकिंग',
      quickSupport: 'किसान सहायता केंद्र',
      supportDesc: 'बुकिंग या मशीन से जुड़ी किसी भी सहायता के लिए संपर्क करें।',
      callHelpline: 'सहायता केंद्र से जुड़ें',
      noBookings: 'आपने अभी तक कोई बुकिंग नहीं की है।',
    },
    marketplace: {
      title: 'कृषि मशीन बाजार',
      subtitle: 'अपने जिले और तहसील में उपलब्ध सभी खेती उपकरण देखें।',
      searchPlaceholder: 'ट्रैक्टर, रोटावेटर, गांव या ब्रांड खोजें...',
      filters: 'फ़िल्टर',
      resetFilters: 'फ़िल्टर हटाएं',
      category: 'मशीन प्रकार',
      locationFilter: 'जिला / तहसील',
      maxDistance: 'अधिकतम दूरी (किमी)',
      maxPrice: 'अधिकतम किराया (₹)',
      priceUnit: 'किराया इकाई',
      availableDate: 'उपलब्ध तारीख',
      minRating: 'न्यूनतम रेटिंग',
      sortBy: 'क्रमबद्ध करें',
      sortNearest: 'सबसे नजदीक',
      sortLowestPrice: 'कम किराया पहले',
      sortHighestRated: 'उच्चतम रेटिंग',
      sortRecent: 'नया पहले',
      listView: 'सूची देखें',
      mapView: 'मानचित्र देखें',
      mapNotice:
        'महाराष्ट्र तहसील मानचित्र मोड सक्रिय है (लाइव Google Maps API कुंजी के बिना क्षेत्रीय निर्देशांक उपयोग हो रहे हैं)।',
      noResults: 'चुने गए फ़िल्टर से कोई मशीन नहीं मिली।',
      resultsCount: 'मशीनें उपलब्ध',
      allDistricts: 'सभी 36 जिले',
      allTalukas: 'सभी तहसीलें',
      allVillages: 'सभी गांव',
      districtLabel: 'जिला',
      talukaLabel: 'तहसील',
      villageLabel: 'गांव',
      searchLocationPlaceholder: 'महाराष्ट्र का कोई भी गांव, तहसील या जिला खोजें...',
      onlyAvailable: 'केवल उपलब्ध',
      withOperator: 'ड्राइवर सहित',
      withDelivery: 'खेत तक डिलीवरी',
      coverageBanner: 'महाराष्ट्र 36 जिले · 358 तहसीलें · गांव खोज सुविधा',
    },
    details: {
      specifications: 'मशीन के विनिर्देश',
      rentalConditions: 'किराए की शर्तें',
      availableDates: 'उपलब्ध तिथियां',
      locationMap: 'स्थान और दूरी',
      ownerInfo: 'मशीन मालिक की जानकारी',
      relatedEquipment: 'संबंधित अन्य मशीनें',
      customerReviews: 'किसानों की समीक्षाएं और रेटिंग',
      ratingBreakdown: 'कुल रेटिंग',
      noPhoneNote: 'मालिक का नंबर संपर्क बटन के माध्यम से उपलब्ध है।',
    },
    booking: {
      requestBooking: 'बुकिंग अनुरोध भेजें',
      selectDate: 'काम की तारीख',
      startTime: 'शुरू करने का समय',
      duration: 'अवधि',
      acresLabel: 'खेत का क्षेत्र (एकड़)',
      farmLocation: 'खेत का पता / गांव',
      farmLocationPlaceholder: 'उदा. पिंपलगांव शिवार, नहर के पास',
      deliveryRequired: 'क्या खेत तक डिलीवरी चाहिए?',
      deliveryYes: 'हां, खेत पर डिलीवरी चाहिए',
      deliveryNo: 'नहीं, स्वयं ले जाऊंगा',
      notes: 'काम का विवरण (वैकल्पिक)',
      notesPlaceholder: 'उदा. गन्ने की बुवाई के लिए खेत तैयार करना है',
      costSummary: 'अनुमानित खर्च विवरण',
      baseRental: 'मूल किराया',
      deliveryCharge: 'डिलीवरी शुल्क',
      operatorCharge: 'ऑपरेटर शुल्क',
      totalEstimate: 'कुल अनुमानित राशि',
      submitRequest: 'बुकिंग अनुरोध भेजें',
      pendingNote: 'नोट: मालिक द्वारा स्वीकार किए जाने के बाद ही बुकिंग पक्की मानी जाएगी।',
      confirmedTitle: 'आपका बुकिंग अनुरोध भेज दिया गया है!',
      confirmedBody: 'मशीन मालिक को सूचना मिल गई है। मंजूरी मिलते ही आपको अपडेट मिलेगा।',
      myBookings: 'मेरी बुकिंग',
      upcoming: 'आगामी और सक्रिय',
      history: 'पिछला इतिहास',
      cancelBooking: 'बुकिंग रद्द करें',
      cancelPolicy: 'काम की तारीख से पहले बुकिंग रद्द की जा सकती है।',
      writeReview: 'रेटिंग और समीक्षा लिखें',
      yourRating: 'आपकी रेटिंग (1 से 5 स्टार)',
      yourReview: 'मशीन और सेवा के बारे में लिखें',
      submitReview: 'समीक्षा सबमिट करें',
      reviewSubmitted: 'समीक्षा सहेजी गई',
      signInToBook: 'बुकिंग करने के लिए कृपया लॉगिन करें',
    },
    owner: {
      title: 'मशीन मालिक डैशबोर्ड',
      subtitle: 'अपनी मशीनें, बुकिंग अनुरोध और मासिक आय प्रबंधित करें।',
      totalListings: 'कुल मशीनें',
      activeEquipment: 'सक्रिय मशीनें',
      pendingRequests: 'लंबित अनुरोध',
      confirmedBookings: 'स्वीकृत बुकिंग',
      completedBookings: 'पूर्ण काम',
      monthlyEarnings: 'इस महीने की कमाई',
      recentActivity: 'हाल की गतिविधि',
      addEquipment: 'नई मशीन जोड़ें',
      editEquipment: 'मशीन संपादित करें',
      myEquipment: 'मेरी मशीनें',
      bookingRequests: 'बुकिंग अनुरोध',
      accept: 'स्वीकार करें',
      reject: 'अस्वीकार करें',
      markCompleted: 'काम पूरा हुआ',
      customerInfo: 'किसान की जानकारी',
      toggleActive: 'उपलब्धता बदलें',
      enableOwnerRole: 'मशीन मालिक खाता शुरू करें',
      enableOwnerDesc: 'अगर आपके पास ट्रैक्टर या उपकरण हैं, तो उन्हें किराए पर देने के लिए मालिक डैशबोर्ड चालू करें।',
      noListings: 'आपने अभी तक कोई मशीन नहीं जोड़ी है।',
      noRequests: 'अभी कोई नया बुकिंग अनुरोध नहीं है।',
    },
    form: {
      category: 'मशीन श्रेणी',
      title: 'मशीन का नाम',
      titlePlaceholder: 'उदा. महिंद्रा अर्जुन नोवो 605 ट्रैक्टर',
      brand: 'ब्रांड',
      model: 'मॉडल',
      description: 'मशीन का विवरण',
      price: 'किराया दर (₹)',
      priceUnit: 'दर इकाई',
      village: 'गांव',
      taluka: 'तहसील',
      district: 'जिला',
      state: 'राज्य',
      hubPreset: 'नजदीकी केंद्र चुनें',
      availableDates: 'उपलब्ध तिथियां (कॉमा से अलग)',
      horsepower: 'हॉर्सपावर / क्षमता',
      fuelType: 'ईंधन प्रकार',
      workingWidth: 'कार्य चौड़ाई',
      year: 'वर्ष',
      deliveryCharge: 'डिलीवरी शुल्क (₹)',
      operatorAvailable: 'क्या ड्राइवर/ऑपरेटर उपलब्ध है?',
      operatorCharge: 'ऑपरेटर शुल्क (₹)',
      rentalConditions: 'किराए की शर्तें',
      contactPhone: 'संपर्क मोबाइल नंबर',
      photos: 'मशीन की तस्वीरें',
      addPhotoUrl: 'फोटो लिंक जोड़ें या नीचे गैलरी से चुनें',
      uploadPhoto: 'फोटो अपलोड करें',
      publishEquipment: 'मशीन प्रकाशित करें',
      updateEquipment: 'बदलाव सहेजें',
      successPublished: 'आपकी मशीन सफलतापूर्वक सूचीबद्ध हो गई!',
    },
    auth: {
      title: 'FarmRent लॉगिन / पंजीकरण',
      demoBanner:
        'प्रीव्यू डेमो ऑथ मोड: लाइव SMS OTP और Firebase जुड़ा न होने के कारण परीक्षण के लिए डेमो लॉगिन या ईमेल/पासवर्ड का उपयोग करें।',
      tabDemo: 'त्वरित डेमो लॉगिन',
      tabEmail: 'ईमेल लॉगिन',
      tabPhone: 'फोन OTP (डेमो)',
      tabForgot: 'पासवर्ड रीसेट',
      quickFarmer: 'किसान के रूप में देखें (रमेश पाटिल)',
      quickOwner: 'मशीन मालिक के रूप में देखें (सुरेश देशमुख)',
      quickBoth: 'किसान + मालिक दोनों (नया खाता)',
      nameLabel: 'पूरा नाम',
      emailLabel: 'ईमेल पता',
      passwordLabel: 'पासवर्ड',
      phoneLabel: 'मोबाइल नंबर (+91)',
      otpLabel: '6 अंकों का OTP',
      sendOtp: 'डेमो OTP प्राप्त करें',
      verifyOtp: 'OTP सत्यापित करें',
      demoOtpHint: 'डेमो प्रीव्यू OTP कोड:',
      signInBtn: 'लॉगिन करें',
      signUpBtn: 'खाता बनाएं',
      createAccountToggle: 'नए हैं? नया खाता बनाएं',
      haveAccountToggle: 'पहले से खाता है? लॉगिन करें',
      forgotPasswordBtn: 'पासवर्ड भूल गए?',
      resetPasswordBtn: 'पासवर्ड रीसेट करें',
      logout: 'लॉगआउट',
      profileTitle: 'मेरी प्रोफाइल और सेटिंग्स',
      roleFarmer: 'किसान (किराएदार)',
      roleOwner: 'मशीन मालिक',
      languagePref: 'पसंदीदा भाषा',
      notifications: 'सूचनाएं',
      markAllRead: 'सभी पढ़ा हुआ चिह्नित करें',
    },
    footer: {
      about: 'हमारे बारे में',
      contact: 'संपर्क करें',
      terms: 'नियम और शर्तें',
      privacy: 'गोपनीयता नीति',
      help: 'सहायता',
      language: 'भाषा',
      copyright: '© 2026 FarmRent महाराष्ट्र. भारतीय किसानों के लिए।',
    },
  },
  en: {
    brand: 'FarmRent',
    tagline: 'Rent Farming Equipment Near You.',
    nav: {
      home: 'Home',
      marketplace: 'Marketplace',
      bookings: 'Bookings',
      ownerHub: 'Owner Hub',
      profile: 'Profile',
      support: 'Help',
      signIn: 'Sign In',
      dashboard: 'Farmer Home',
    },
    hero: {
      headline: 'Farm Machinery Near Your Field!',
      subheading:
        'Rent tractors, rotavators, harvesters, sprayers, and agricultural implements at fair hourly, daily, or per-acre rates directly from local owners.',
      locationPlaceholder: 'Select village, taluka, or district',
      equipmentPlaceholder: 'What machine do you need? (Tractor, Harvester...)',
      dateLabel: 'Date',
      searchBtn: 'Search',
      rentCta: 'Rent Equipment',
      listCta: 'List Your Equipment',
      trust1: 'Direct owner call & WhatsApp',
      trust2: 'Transparent hour, day & acre rates',
      trust3: 'Marathi, Hindi & English support',
    },
    sections: {
      popularCategories: 'Popular Equipment Categories',
      featuredEquipment: 'Featured Machinery Nearby',
      viewAllMarketplace: 'Browse All Machines',
      howItWorks: 'How FarmRent Works',
      benefitsTitle: 'Built for Indian Farmers',
      forOwnersTitle: 'Turn Idle Machinery into Monthly Income',
      forOwnersSub:
        'List your tractor, combine harvester, or farm implements and receive direct rental requests from verified nearby farmers.',
      forOwnersList1: 'Free equipment listing with full control over pricing units',
      forOwnersList2: 'Accept or decline booking requests on your own schedule',
      forOwnersList3: 'Direct farmer communication via Call and WhatsApp',
      testimonialsTitle: 'Stories from Farmers & Owners',
      demoLabel: 'Sample Demo',
    },
    steps: {
      s1Title: '1. Find a Machine',
      s1Desc: 'Pick your village or district and browse nearby available equipment.',
      s2Title: '2. Choose Date & Time',
      s2Desc: 'Select your farming date, start time, and required hours or acres.',
      s3Title: '3. Request Booking',
      s3Desc: 'Review the itemized cost estimate and send a request to the owner.',
      s4Title: '4. Confirm & Work',
      s4Desc: 'Once the owner accepts your request, the machine arrives as scheduled.',
    },
    benefits: {
      b1Title: 'Save Capital Costs',
      b1Desc: 'Access heavy farm machinery only when needed without large loans.',
      b2Title: 'Nearby Availability',
      b2Desc: 'Filter by distance in km so machines reach your farm quickly.',
      b3Title: 'Direct Owner Contact',
      b3Desc: 'No middlemen—call or message owners directly on WhatsApp.',
      b4Title: 'Clear Booking Status',
      b4Desc: 'Track pending requests, confirmations, and past rentals cleanly.',
    },
    categories: {
      tractor: 'Tractor',
      rotavator: 'Rotavator',
      harvester: 'Harvester',
      cultivator: 'Cultivator',
      seed_drill: 'Seed Drill',
      sprayer: 'Sprayer',
      thresher: 'Thresher',
      trailer: 'Trailer / Trolley',
      plough: 'MB Plough',
      jcb: 'JCB / Earthmover',
      transport: 'Agri Transport',
      other: 'Other Machines',
    },
    units: {
      hour: 'hour',
      day: 'day',
      acre: 'acre',
      trip: 'trip',
    },
    statuses: {
      pending: 'Pending Owner Approval',
      accepted: 'Accepted',
      rejected: 'Rejected',
      cancelled: 'Cancelled',
      completed: 'Completed',
    },
    common: {
      all: 'All',
      available: 'Available',
      unavailable: 'Currently Booked',
      verifiedOwner: 'Verified Owner',
      unverifiedOwner: 'Unverified Owner',
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      callOwner: 'Call Owner',
      whatsappOwner: 'WhatsApp',
      contactOwner: 'Contact Owner',
      kmAway: 'km away',
      per: 'per',
      reviews: 'reviews',
      noReviews: 'No reviews yet for this machine.',
      loading: 'Loading equipment...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      confirm: 'Confirm',
      back: 'Back',
      close: 'Close',
      submit: 'Submit',
      demoTag: 'Demo Listing',
      operatorIncluded: 'Operator available',
      deliveryAvailable: 'Farm delivery available',
    },
    dashboard: {
      welcome: 'Welcome',
      selectedLocation: 'Selected Location',
      changeLocation: 'Change Location',
      useGps: 'Use GPS',
      gpsExplainTitle: 'Allow Location to Find Nearby Machines',
      gpsExplainBody:
        'FarmRent uses your location only to calculate distances to nearby tractors and farm machinery in your taluka and district.',
      allowGps: 'Allow GPS Access',
      nearbyMachines: 'Nearby Machines',
      recommended: 'Recommended in Your District',
      recentListings: 'Recently Listed',
      upcomingBookings: 'Your Upcoming Bookings',
      quickSupport: 'Farmer Support Desk',
      supportDesc: 'Need help choosing an implement or checking a booking status?',
      callHelpline: 'Open Support & Help',
      noBookings: 'You have no bookings yet. Browse the marketplace to request one.',
    },
    marketplace: {
      title: 'Equipment Marketplace',
      subtitle: 'Search verified local equipment across Maharashtra talukas and villages.',
      searchPlaceholder: 'Search tractor, rotavator, village, or brand...',
      filters: 'Filters',
      resetFilters: 'Reset',
      category: 'Equipment Type',
      locationFilter: 'District / Taluka',
      maxDistance: 'Max Distance (km)',
      maxPrice: 'Max Price (₹)',
      priceUnit: 'Pricing Unit',
      availableDate: 'Available Date',
      minRating: 'Minimum Rating',
      sortBy: 'Sort By',
      sortNearest: 'Nearest First',
      sortLowestPrice: 'Lowest Price',
      sortHighestRated: 'Highest Rated',
      sortRecent: 'Recently Listed',
      listView: 'List View',
      mapView: 'Map View',
      mapNotice:
        'Using stored Maharashtra district & taluka coordinates (Google Maps API key not connected). Click pins to inspect nearby machines.',
      noResults: 'No machinery matches your selected filters.',
      resultsCount: 'machines found',
      allDistricts: 'All 36 Districts',
      allTalukas: 'All Talukas',
      allVillages: 'All Villages',
      districtLabel: 'District',
      talukaLabel: 'Taluka',
      villageLabel: 'Village',
      searchLocationPlaceholder: 'Search any village, taluka, or district in Maharashtra...',
      onlyAvailable: 'Available Only',
      withOperator: 'With Operator',
      withDelivery: 'Farm Delivery',
      coverageBanner: 'Maharashtra 36 Districts · 358 Talukas · Village Search',
    },
    details: {
      specifications: 'Specifications',
      rentalConditions: 'Rental Conditions',
      availableDates: 'Available Dates',
      locationMap: 'Location & Distance',
      ownerInfo: 'Equipment Owner',
      relatedEquipment: 'Related Equipment Nearby',
      customerReviews: 'Farmer Ratings & Reviews',
      ratingBreakdown: 'Overall Rating',
      noPhoneNote: 'Contact options are enabled using the owner contact details.',
    },
    booking: {
      requestBooking: 'Request Booking',
      selectDate: 'Rental Date',
      startTime: 'Start Time',
      duration: 'Duration',
      acresLabel: 'Farm Area (Acres)',
      farmLocation: 'Farm Location / Village / Landmark',
      farmLocationPlaceholder: 'e.g. Malegaon Bk, near Canal Gate 4',
      deliveryRequired: 'Need delivery to your farm?',
      deliveryYes: 'Yes, deliver to my farm',
      deliveryNo: 'No, I will pick up / coordinate nearby',
      notes: 'Additional Notes (Optional)',
      notesPlaceholder: 'e.g. Need 6-feet rotavator for sugarcane field prep',
      costSummary: 'Estimated Cost Summary',
      baseRental: 'Base Rental',
      deliveryCharge: 'Delivery Charge',
      operatorCharge: 'Operator Charge',
      totalEstimate: 'Estimated Total',
      submitRequest: 'Submit Booking Request',
      pendingNote:
        'Note: A booking is not confirmed until the equipment owner reviews and accepts your request.',
      confirmedTitle: 'Booking Request Submitted!',
      confirmedBody:
        'The owner has been notified. Track approval status anytime in your Bookings tab.',
      myBookings: 'My Bookings',
      upcoming: 'Upcoming & Active',
      history: 'Past History',
      cancelBooking: 'Cancel Booking',
      cancelPolicy: 'You can cancel pending or upcoming bookings before the scheduled start date.',
      writeReview: 'Rate & Review',
      yourRating: 'Your Rating (1 to 5 stars)',
      yourReview: 'Share your experience with this machine & owner',
      submitReview: 'Submit Review',
      reviewSubmitted: 'Review submitted',
      signInToBook: 'Sign in to request a booking',
    },
    owner: {
      title: 'Equipment Owner Dashboard',
      subtitle: 'Manage your fleet, incoming rental requests, availability, and earnings.',
      totalListings: 'Total Listings',
      activeEquipment: 'Active Machines',
      pendingRequests: 'Pending Requests',
      confirmedBookings: 'Confirmed Bookings',
      completedBookings: 'Completed Jobs',
      monthlyEarnings: 'Monthly Earnings',
      recentActivity: 'Recent Activity',
      addEquipment: 'Add Equipment',
      editEquipment: 'Edit Equipment',
      myEquipment: 'My Equipment',
      bookingRequests: 'Booking Requests',
      accept: 'Accept',
      reject: 'Reject',
      markCompleted: 'Mark Completed',
      customerInfo: 'Customer Info',
      toggleActive: 'Toggle Availability',
      enableOwnerRole: 'Activate Equipment Owner Mode',
      enableOwnerDesc:
        'Own a tractor, rotavator, or harvester? Enable owner mode on your account to list machines and receive bookings.',
      noListings: 'You have not listed any equipment yet.',
      noRequests: 'No booking requests yet.',
    },
    form: {
      category: 'Equipment Category',
      title: 'Equipment Name',
      titlePlaceholder: 'e.g. Mahindra Arjun Novo 605 DI Tractor',
      brand: 'Brand',
      model: 'Model',
      description: 'Description',
      price: 'Rental Price (₹)',
      priceUnit: 'Pricing Unit',
      village: 'Village',
      taluka: 'Taluka',
      district: 'District',
      state: 'State',
      hubPreset: 'Select Nearest Maharashtra Hub (for distance accuracy)',
      availableDates: 'Available Dates (comma-separated YYYY-MM-DD)',
      horsepower: 'Horsepower / Engine',
      fuelType: 'Fuel Type',
      workingWidth: 'Working Width / Capacity',
      year: 'Model Year',
      deliveryCharge: 'Optional Delivery Charge (₹)',
      operatorAvailable: 'Operator / Driver included?',
      operatorCharge: 'Optional Operator Charge (₹)',
      rentalConditions: 'Rental Conditions (e.g. Fuel rules, deposit)',
      contactPhone: 'Owner Contact Phone (for Call & WhatsApp)',
      photos: 'Equipment Photos',
      addPhotoUrl: 'Add photo URL or pick a machinery photo below',
      uploadPhoto: 'Upload Photo',
      publishEquipment: 'Publish Equipment Listing',
      updateEquipment: 'Save Equipment Changes',
      successPublished: 'Your equipment listing is now live in the marketplace!',
    },
    auth: {
      title: 'Sign In to FarmRent',
      demoBanner:
        'Preview Demo Auth Mode: Live SMS OTP and external Firebase credentials are not configured in this preview. Use Demo Sign-In or Email & Password to test all workflows.',
      tabDemo: 'Demo Accounts',
      tabEmail: 'Email Login',
      tabPhone: 'Phone OTP (Demo)',
      tabForgot: 'Reset Password',
      quickFarmer: 'Continue as Farmer (Ramesh Patil - Baramati)',
      quickOwner: 'Continue as Owner (Suresh Deshmukh - Niphad)',
      quickBoth: 'Create Dual-Role Account (Farmer + Owner)',
      nameLabel: 'Full Name',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      phoneLabel: 'Phone Number (+91)',
      otpLabel: '6-Digit Verification Code',
      sendOtp: 'Generate Demo OTP',
      verifyOtp: 'Verify & Sign In',
      demoOtpHint: 'Demo Preview OTP Code:',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Account',
      createAccountToggle: 'New to FarmRent? Create an account',
      haveAccountToggle: 'Already have an account? Sign in',
      forgotPasswordBtn: 'Forgot password?',
      resetPasswordBtn: 'Reset Password',
      logout: 'Sign Out',
      profileTitle: 'Profile & Settings',
      roleFarmer: 'Farmer / Renter',
      roleOwner: 'Equipment Owner',
      languagePref: 'Preferred Language',
      notifications: 'Notifications',
      markAllRead: 'Mark all read',
    },
    footer: {
      about: 'About',
      contact: 'Contact',
      terms: 'Terms',
      privacy: 'Privacy Policy',
      help: 'Help',
      language: 'Language',
      copyright: '© 2026 FarmRent Maharashtra. Empowering Indian Farmers.',
    },
  },
};
