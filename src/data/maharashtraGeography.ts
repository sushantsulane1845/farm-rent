export interface MaharashtraVillage {
  nameEn: string;
  nameMr: string;
}

export interface MaharashtraTaluka {
  id: string;
  nameEn: string;
  nameMr: string;
  lat: number;
  lng: number;
  villages: MaharashtraVillage[];
}

export interface MaharashtraDistrict {
  id: string;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  division: 'Konkan' | 'Pune' | 'Nashik' | 'Chh. Sambhajinagar' | 'Amravati' | 'Nagpur';
  lat: number;
  lng: number;
  talukas: MaharashtraTaluka[];
}

type TalukaSeed = [
  nameEn: string,
  nameMr: string,
  dLat: number,
  dLng: number,
  villages: Array<[string, string]>
];

function buildTalukas(
  districtId: string,
  baseLat: number,
  baseLng: number,
  seeds: TalukaSeed[]
): MaharashtraTaluka[] {
  return seeds.map(([nameEn, nameMr, dLat, dLng, villages]) => ({
    id: `${districtId}-${nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    nameEn,
    nameMr,
    lat: Number((baseLat + dLat).toFixed(4)),
    lng: Number((baseLng + dLng).toFixed(4)),
    villages: villages.map(([vEn, vMr]) => ({ nameEn: vEn, nameMr: vMr })),
  }));
}

export const MAHARASHTRA_DISTRICTS: MaharashtraDistrict[] = [
  // ==================== KONKAN DIVISION ====================
  {
    id: 'mumbai-city',
    nameEn: 'Mumbai City',
    nameMr: 'मुंबई शहर',
    nameHi: 'मुंबई शहर',
    division: 'Konkan',
    lat: 18.9388,
    lng: 72.8354,
    talukas: buildTalukas('mumbai-city', 18.9388, 72.8354, [
      ['Colaba', 'कुलाबा', -0.03, -0.01, [['Colaba', 'कुलाबा'], ['Fort', 'फोर्ट'], ['Marine Lines', 'मरीन लाईन्स']]],
      ['Dadar', 'दादर', 0.08, 0.01, [['Dadar', 'दादर'], ['Matunga', 'माटुंगा'], ['Worli', 'वरळी'], ['Parel', 'परळ']]],
      ['Sion', 'शीव (सायन)', 0.10, 0.03, [['Sion', 'शीव'], ['Wadala', 'वडाळा'], ['Mahim', 'माहीम'], ['Dharavi', 'धारावी']]],
    ]),
  },
  {
    id: 'mumbai-suburban',
    nameEn: 'Mumbai Suburban',
    nameMr: 'मुंबई उपनगर',
    nameHi: 'मुंबई उपनगर',
    division: 'Konkan',
    lat: 19.1136,
    lng: 72.8697,
    talukas: buildTalukas('mumbai-suburban', 19.1136, 72.8697, [
      ['Andheri', 'अंधेरी', 0.01, -0.02, [['Andheri', 'अंधेरी'], ['Juhu', 'जुहू'], ['Vile Parle', 'विलेपार्ले'], ['Goregaon', 'गोरेगाव'], ['Aarey Colony', 'आरे कॉलनी']]],
      ['Borivali', 'बोरिवली', 0.11, -0.01, [['Borivali', 'बोरिवली'], ['Kandivali', 'कांदिवली'], ['Malad', 'मालाड'], ['Dahisar', 'दहिसर'], ['Gorai', 'गोराई'], ['Manori', 'मनोरी']]],
      ['Kurla', 'कुर्ला', -0.04, 0.02, [['Kurla', 'कुर्ला'], ['Chembur', 'चेंबूर'], ['Ghatkopar', 'घाटकोपर'], ['Mulund', 'मुलुंड'], ['Bhandup', 'भांडुप'], ['Powai', 'पवई']]],
    ]),
  },
  {
    id: 'thane',
    nameEn: 'Thane',
    nameMr: 'ठाणे',
    nameHi: 'ठाणे',
    division: 'Konkan',
    lat: 19.2183,
    lng: 72.9781,
    talukas: buildTalukas('thane', 19.2183, 72.9781, [
      ['Thane', 'ठाणे', 0, 0, [['Thane', 'ठाणे'], ['Ghodbunder', 'घोडबंदर'], ['Yeoor', 'येऊर'], ['Kolshet', 'कोलशेत'], ['Diva', 'दिवा']]],
      ['Kalyan', 'कल्याण', 0.02, 0.15, [['Kalyan', 'कल्याण'], ['Titwala', 'टिटवाळा'], ['Manda', 'मांडा'], ['Varap', 'वरप'], ['Rayate', 'रायते']]],
      ['Murbad', 'मुरबाड', 0.03, 0.42, [['Murbad', 'मुरबाड'], ['Saralgaon', 'सरळगाव'], ['Dhasai', 'धसई'], ['Tokawade', 'टोकावडे'], ['Kishor', 'किशोर']]],
      ['Bhiwandi', 'भिवंडी', 0.08, 0.08, [['Bhiwandi', 'भिवंडी'], ['Padgha', 'पडघा'], ['Vajreshwari', 'वज्रेश्वरी'], ['Ganeshpuri', 'गणेशपुरी'], ['Anjur', 'अंजूर']]],
      ['Shahapur', 'शहापूर', 0.23, 0.35, [['Shahapur', 'शहापूर'], ['Asangaon', 'आसनगाव'], ['Kasara', 'कसारा'], ['Khardi', 'खर्डी'], ['Kinholi', 'किन्होळी'], ['Dolkhamb', 'डोळखांब']]],
      ['Ulhasnagar', 'उल्हासनगर', 0.00, 0.18, [['Ulhasnagar', 'उल्हासनगर'], ['Vithalwadi', 'विठ्ठलवाडी']]],
      ['Ambernath', 'अंबरनाथ', -0.02, 0.21, [['Ambernath', 'अंबरनाथ'], ['Badlapur', 'बदलापूर'], ['Vangani', 'वांगणी'], ['Goregaon', 'गोरेगाव']]],
    ]),
  },
  {
    id: 'palghar',
    nameEn: 'Palghar',
    nameMr: 'पालघर',
    nameHi: 'पालघर',
    division: 'Konkan',
    lat: 19.6967,
    lng: 72.7699,
    talukas: buildTalukas('palghar', 19.6967, 72.7699, [
      ['Palghar', 'पालघर', 0, 0, [['Palghar', 'पालघर'], ['Boisar', 'बोईसर'], ['Kelwa', 'केळवे'], ['Manor', 'मनोर'], ['Satpati', 'सातपाटी'], ['Saphale', 'सफाळे']]],
      ['Vasai', 'वसई', -0.30, 0.06, [['Vasai', 'वसई'], ['Virar', 'विरार'], ['Nalasopara', 'नालासोपारा'], ['Agashi', 'आगाशी'], ['Arnala', 'अर्नाळा']]],
      ['Dahanu', 'डहाणू', 0.27, -0.04, [['Dahanu', 'डहाणू'], ['Gholvad', 'घोलवड'], ['Bordi', 'बोर्डी'], ['Chinchani', 'चिंचणी'], ['Kasa', 'कासा'], ['Charoti', 'चारोटी']]],
      ['Talasari', 'तलासरी', 0.42, 0.14, [['Talasari', 'तलासरी'], ['Zari', 'झरी'], ['Sutrakar', 'सुत्रकार'], ['Udhawa', 'उधवा']]],
      ['Jawhar', 'जव्हार', 0.21, 0.46, [['Jawhar', 'जव्हार'], ['Sakharshet', 'साखरशेत'], ['Dabheri', 'दाभेरी'], ['Jamsar', 'जामसर']]],
      ['Mokhada', 'मोखाडा', 0.24, 0.57, [['Mokhada', 'मोखाडा'], ['Khodala', 'खोडाळा'], ['Poshera', 'पोशेरा'], ['Ase', 'असे']]],
      ['Vada', 'वाडा', -0.04, 0.37, [['Vada', 'वाडा'], ['Kudus', 'कुडूस'], ['Khanivali', 'खानिवली'], ['Ambiste', 'आंबिस्ते'], ['Pali', 'पाली']]],
      ['Vikramgad', 'विक्रमगड', 0.09, 0.32, [['Vikramgad', 'विक्रमगड'], ['Alonde', 'आलोंडे'], ['Sakhare', 'साखरे'], ['Talwada', 'तलवाडा']]],
    ]),
  },
  {
    id: 'raigad',
    nameEn: 'Raigad',
    nameMr: 'रायगड',
    nameHi: 'रायगढ़',
    division: 'Konkan',
    lat: 18.6414,
    lng: 72.8722,
    talukas: buildTalukas('raigad', 18.6414, 72.8722, [
      ['Alibag', 'अलिबाग', 0, 0, [['Alibag', 'अलिबाग'], ['Revdanda', 'रेवदंडा'], ['Nagaon', 'नागाव'], ['Poynad', 'पोयनाड'], ['Chondhi', 'चोंढी'], ['Kihim', 'किहीम']]],
      ['Pen', 'पेण', 0.10, 0.22, [['Pen', 'पेण'], ['Wadkhal', 'वडखळ'], ['Kasu', 'कासू'], ['Hamarapur', 'हमरापूर'], ['Joysari', 'जॉयसरी']]],
      ['Panvel', 'पनवेल', 0.35, 0.24, [['Panvel', 'पनवेल'], ['Kalamboli', 'कळंबोली'], ['Kharghar', 'खारघर'], ['Palaspe', 'पळस्पे'], ['Rasayani', 'रसायनी']]],
      ['Uran', 'उरण', 0.24, 0.06, [['Uran', 'उरण'], ['Mora', 'मोरा'], ['Karanja', 'करंजा'], ['Jasai', 'जसाई'], ['Chirner', 'चिरनेर']]],
      ['Karjat', 'कर्जत', 0.27, 0.45, [['Karjat', 'कर्जत'], ['Neral', 'नेरळ'], ['Matheran', 'माथेरान'], ['Kashele', 'कशेळे'], ['Kadva', 'कडव']]],
      ['Khalapur', 'खालापूर', 0.19, 0.41, [['Khalapur', 'खालापूर'], ['Khopoli', 'खोपोली'], ['Chowk', 'चौक'], ['Savroli', 'सावरोली']]],
      ['Roha', 'रोहा', -0.20, 0.25, [['Roha', 'रोहा'], ['Kolad', 'कोलाड'], ['Nagothane', 'नागोठाणे'], ['Chanera', 'चानेरा']]],
      ['Sudhagad (Pali)', 'सुधागड (पाली)', -0.11, 0.35, [['Pali', 'पाली'], ['Jambhulpada', 'जांभूळपाडा'], ['Siddheshwar', 'सिद्धेश्वर'], ['Parali', 'परळी']]],
      ['Mangaon', 'माणगाव', -0.41, 0.41, [['Mangaon', 'माणगाव'], ['Goregaon', 'गोरेगाव'], ['Nizampur', 'निजामपूर'], ['Lonere', 'लोणेरे']]],
      ['Tala', 'तळा', -0.35, 0.25, [['Tala', 'तळा'], ['Medhe', 'मेढे'], ['Pitsai', 'पिटसई'], ['Rahatad', 'रहाताड']]],
      ['Mahad', 'महाड', -0.55, 0.55, [['Mahad', 'महाड'], ['Birwadi', 'बिरवाडी'], ['Nate', 'नाते'], ['Dasgaon', 'दासगाव'], ['Raigadwadi', 'रायगडवाडी']]],
      ['Poladpur', 'पोलादपूर', -0.66, 0.59, [['Poladpur', 'पोलादपूर'], ['Kashedi', 'कशेडी'], ['Lohare', 'लोहारे'], ['Kapade', 'कापडे']]],
      ['Mhasala', 'म्हसळा', -0.48, 0.24, [['Mhasala', 'म्हसळा'], ['Mendadi', 'मेंदडी'], ['Pabhare', 'पाभरे'], ['Khamgaon', 'खामगाव']]],
      ['Shrivardhan', 'श्रीवर्धन', -0.59, 0.14, [['Shrivardhan', 'श्रीवर्धन'], ['Harihareshwar', 'हरिहरेश्वर'], ['Diveagar', 'दिवेआगर'], ['Borli Panchatan', 'बोर्ली पंचतन']]],
      ['Murud', 'मुरुड', -0.31, 0.09, [['Murud', 'मुरुड'], ['Kashid', 'काशीद'], ['Nandgaon', 'नांदगाव'], ['Borli', 'बोर्ली']]],
    ]),
  },
  {
    id: 'ratnagiri',
    nameEn: 'Ratnagiri',
    nameMr: 'रत्नागिरी',
    nameHi: 'रत्नागिरी',
    division: 'Konkan',
    lat: 16.9902,
    lng: 73.3120,
    talukas: buildTalukas('ratnagiri', 16.9902, 73.3120, [
      ['Ratnagiri', 'रत्नागिरी', 0, 0, [['Ratnagiri', 'रत्नागिरी'], ['Ganpatipule', 'गणपतीपुळे'], ['Pawas', 'पावस'], ['Hathkhamba', 'हातखंबा'], ['Mirjole', 'मिर्जोळे'], ['Malguund', 'मालगुंड']]],
      ['Mandangad', 'मंडणगड', 0.99, -0.17, [['Mandangad', 'मंडणगड'], ['Bankot', 'बाणकोट'], ['Devhare', 'देव्हारे'], ['Mhapral', 'म्हाप्रळ']]],
      ['Dapoli', 'दापोली', 0.77, -0.12, [['Dapoli', 'दापोली'], ['Harnai', 'हर्णै'], ['Murud', 'मुरुड'], ['Dabhol', 'दाभोळ'], ['Anjarle', 'आंजर्ले'], ['Kelshi', 'केळशी']]],
      ['Khed', 'खेड', 0.73, 0.08, [['Khed', 'खेड'], ['Lote', 'लोटे'], ['Bharne', 'भरणे'], ['Shivtar', 'शिवतर'], ['Dhamnand', 'धामणंद']]],
      ['Chiplun', 'चिपळूण', 0.54, 0.21, [['Chiplun', 'चिपळूण'], ['Sawarde', 'सावर्डे'], ['Kherdi', 'खेर्डी'], ['Dervan', 'डेरवण'], ['Pophali', 'पोफळी'], ['Shirgaon', 'शिरगाव']]],
      ['Guhagar', 'गुहागर', 0.49, -0.12, [['Guhagar', 'गुहागर'], ['Hedvi', 'हेदवी'], ['Velneshwar', 'वेलणेश्वर'], ['Palshet', 'पालशेत'], ['Abloli', 'अबलोली']]],
      ['Sangameshwar', 'संगमेश्वर', 0.19, 0.24, [['Sangameshwar', 'संगमेश्वर'], ['Deorukh', 'देवरुख'], ['Kasba', 'कसबा'], ['Makhjan', 'माखजन'], ['Nayari', 'नायरी']]],
      ['Lanja', 'लांजा', -0.14, 0.23, [['Lanja', 'लांजा'], ['Watul', 'वाटूळ'], ['Satavali', 'साटवली'], ['Kurne', 'कुर्णे']]],
      ['Rajapur', 'राजापूर', -0.34, 0.21, [['Rajapur', 'राजापूर'], ['Oni', 'ओणी'], ['Pachal', 'पाचल'], ['Nate', 'नाटे'], ['Jaitapur', 'जैतापूर']]],
    ]),
  },
  {
    id: 'sindhudurg',
    nameEn: 'Sindhudurg',
    nameMr: 'सिंधुदुर्ग',
    nameHi: 'सिंधुदुर्ग',
    division: 'Konkan',
    lat: 16.0170,
    lng: 73.6881,
    talukas: buildTalukas('sindhudurg', 16.0170, 73.6881, [
      ['Kudal', 'कुडाळ', 0, 0, [['Kudal', 'कुडाळ'], ['Oros', 'ओरोस'], ['Zarap', 'झाराप'], ['Pinguli', 'पिंगुळी'], ['Walawal', 'वालावल']]],
      ['Sawantwadi', 'सावंतवाडी', -0.11, -0.06, [['Sawantwadi', 'सावंतवाडी'], ['Amboli', 'आंबोली'], ['Banda', 'बांदा'], ['Masure', 'मसुरे'], ['Charathe', 'चरठे']]],
      ['Vengurla', 'वेंगुर्ला', -0.15, -0.07, [['Vengurla', 'वेंगुर्ला'], ['Shiroda', 'शिरोडा'], ['Redi', 'रेडी'], ['Mochemad', 'मोचेमाड'], ['Ubhadanda', 'उभादांडा']]],
      ['Malvan', 'मालवण', 0.04, -0.22, [['Malvan', 'मालवण'], ['Tarkarli', 'तारकर्ली'], ['Chauke', 'चौके'], ['Achara', 'आचरा'], ['Masure', 'मसुरे']]],
      ['Kankavli', 'कणकवली', 0.25, 0.02, [['Kankavli', 'कणकवली'], ['Janavali', 'जाणवली'], ['Phondaghat', 'फोंडाघाट'], ['Nandgaon', 'नांदगाव'], ['Harkul', 'हरकुळ']]],
      ['Devgad', 'देवगड', 0.36, -0.31, [['Devgad', 'देवगड'], ['Jamsande', 'जामसंडे'], ['Vijaydurg', 'विजयदुर्ग'], ['Shirgaon', 'शिरगाव'], ['Mithbav', 'मिठबाव']]],
      ['Vaibhavwadi', 'वैभववाडी', 0.47, 0.06, [['Vaibhavwadi', 'वैभववाडी'], ['Umbarde', 'उंबर्डे'], ['Bhuibawda', 'भुईबावडा'], ['Kharepatan', 'खारेपाटण']]],
      ['Dodamarg', 'दोडामार्ग', -0.29, 0.16, [['Dodamarg', 'दोडामार्ग'], ['Bhedshi', 'भेडशी'], ['Talkat', 'तळकट'], ['Sasoli', 'सासोली']]],
    ]),
  },

  // ==================== PUNE DIVISION ====================
  {
    id: 'pune',
    nameEn: 'Pune',
    nameMr: 'पुणे',
    nameHi: 'पुणे',
    division: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
    talukas: buildTalukas('pune', 18.5204, 73.8567, [
      ['Baramati', 'बारामती', -0.37, 0.72, [['Malegaon Bk', 'माळेगाव बु.'], ['Baramati', 'बारामती'], ['Supa', 'सुपा'], ['Morgaon', 'मोरगाव'], ['Khandaj', 'खंडाज'], ['Loni Bhapkar', 'लोणी भापकर'], ['Katphal', 'कटफळ']]],
      ['Indapur', 'इंदापूर', -0.41, 1.17, [['Bhavaninagar', 'भवानीनगर'], ['Indapur', 'इंदापूर'], ['Nimgaon Ketki', 'निमगाव केतकी'], ['Walchandnagar', 'वालचंदनगर'], ['Bawda', 'बावडा'], ['Bhigwan', 'भिगवण']]],
      ['Daund', 'दौंड', -0.06, 0.73, [['Daund', 'दौंड'], ['Kedgaon', 'केडगाव'], ['Patas', 'पाटस'], ['Yavat', 'यवत'], ['Varvand', 'वरवंड'], ['Rahu', 'राहू']]],
      ['Shirur', 'शिरूर', 0.31, 0.52, [['Shirur', 'शिरूर'], ['Ranjangaon', 'रांजणगाव'], ['Shikrapur', 'शिक्रापूर'], ['Pabal', 'पाबळ'], ['Kanhur Mesai', 'कान्हूर मेसाई'], ['Nhavara', 'न्हावरा']]],
      ['Junnar', 'जुन्नर', 0.69, 0.02, [['Junnar', 'जुन्नर'], ['Narayangaon', 'नारायणगाव'], ['Alephata', 'आळेफाटा'], ['Otur', 'ओतूर'], ['Bori', 'बोरी'], ['Wadgaon Anand', 'वडगाव आनंद']]],
      ['Ambegaon', 'आंबेगाव', 0.52, 0.08, [['Ghodegaon', 'घोडेगाव'], ['Manchar', 'मंचर'], ['Awasari', 'अवसरी'], ['Pargaon', 'पारगाव'], ['Bhimashankar', 'भीमाशंकर']]],
      ['Khed (Rajgurunagar)', 'खेड (राजगुरुनगर)', 0.34, 0.03, [['Rajgurunagar', 'राजगुरुनगर'], ['Chakan', 'चाकण'], ['Pait', 'पाईट'], ['Wada', 'वाडा'], ['Kadus', 'कडूस']]],
      ['Maval', 'मावळ', 0.23, -0.36, [['Vadgaon Maval', 'वडगाव मावळ'], ['Talegaon Dabhade', 'तळेगाव दाभाडे'], ['Lonavala', 'लोणावळा'], ['Kamshet', 'कामशेत'], ['Takwe', 'टाकवे']]],
      ['Mulshi', 'मुळशी', -0.02, -0.34, [['Paud', 'पौड'], ['Pirangut', 'पिरंगुट'], ['Hinjawadi', 'हिंजवडी'], ['Lavale', 'लवळे'], ['Mulshi', 'मुळशी']]],
      ['Haveli', 'हवेली', -0.04, 0.05, [['Wagholi', 'वाघोली'], ['Loni Kalbhor', 'लोणी काळभोर'], ['Uruli Kanchan', 'उरुळी कांचन'], ['Khadakwasla', 'खडकवासला'], ['Theur', 'थेऊर']]],
      ['Pune City', 'पुणे शहर', 0, 0, [['Shivajinagar', 'शिवाजीनगर'], ['Hadapsar', 'हडपसर'], ['Kothrud', 'कोथरूड'], ['Katraj', 'कात्रज'], ['Manjari', 'मांजरी']]],
      ['Purandar', 'पुरंदर', -0.22, 0.18, [['Saswad', 'सासवड'], ['Jejuri', 'जेजुरी'], ['Parinche', 'परिंचे'], ['Walhe', 'वाल्हे'], ['Nira', 'नीरा']]],
      ['Bhor', 'भोर', -0.37, -0.01, [['Bhor', 'भोर'], ['Nasrapur', 'नसरापूर'], ['Kikvi', 'किकवी'], ['Utroli', 'उत्रोली'], ['Ambavade', 'अंबावडे']]],
      ['Velhe (Rajgad)', 'वेल्हे (राजगड)', -0.23, -0.24, [['Velhe', 'वेल्हे'], ['Panshet', 'पानशेत'], ['Karanjawane', 'करंजावणे'], ['Vinzar', 'विंझर']]],
    ]),
  },
  {
    id: 'satara',
    nameEn: 'Satara',
    nameMr: 'सातारा',
    nameHi: 'सातारा',
    division: 'Pune',
    lat: 17.6805,
    lng: 74.0183,
    talukas: buildTalukas('satara', 17.6805, 74.0183, [
      ['Satara', 'सातारा', 0, 0, [['Satara', 'सातारा'], ['Nagthane', 'नागठाणे'], ['Limb', 'लिंब'], ['Khed', 'खेड'], ['Wadhe', 'वाढे'], ['Sajjangad', 'सज्जनगड']]],
      ['Karad', 'कराड', -0.39, 0.16, [['Umbraj', 'उंब्रज'], ['Karad', 'कराड'], ['Masur', 'मसूर'], ['Ogalewadi', 'ओगलेवाडी'], ['Kale', 'काळे'], ['Undale', 'उंडाळे']]],
      ['Phaltan', 'फलटण', 0.31, 0.41, [['Sakharwadi', 'साखरवाडी'], ['Phaltan', 'फलटण'], ['Barad', 'बरड'], ['Girvi', 'गिरवी'], ['Nimbhore', 'निंभोरे'], ['Lonand Road', 'लोणंद रोड']]],
      ['Wai', 'वाई', 0.27, -0.13, [['Wai', 'वाई'], ['Panchwad', 'पाचवड'], ['Bhuinj', 'भुईंज'], ['Menavali', 'मेणवली'], ['Ozarde', 'ओझर्डे']]],
      ['Mahabaleshwar', 'महाबळेश्वर', 0.24, -0.36, [['Mahabaleshwar', 'महाबळेश्वर'], ['Panchgani', 'पाचगणी'], ['Bhilar', 'भिलार'], ['Tapola', 'तापोळा'], ['Medha Road', 'मेढा रोड']]],
      ['Khandala', 'खंडाळा', 0.37, -0.02, [['Khandala', 'खंडाळा'], ['Lonand', 'लोणंद'], ['Shirwal', 'शिरवळ'], ['Pargaon', 'पारगाव'], ['Ahire', 'अहिरे']]],
      ['Koregaon', 'कोरेगाव', 0.02, 0.15, [['Koregaon', 'कोरेगाव'], ['Rahimatpur', 'रहिमतपूर'], ['Wathar', 'वाठार'], ['Satara Road', 'सातारा रोड'], ['Deur', 'देऊर']]],
      ['Khatav', 'खटाव', -0.04, 0.34, [['Vaduj', 'वडूज'], ['Khatav', 'खटाव'], ['Pusegaon', 'पुसेगाव'], ['Aundh', 'औंध'], ['Mayani', 'मायणी']]],
      ['Man', 'माण', 0.03, 0.56, [['Dahiwadi', 'दहिवडी'], ['Mhaswad', 'म्हसवड'], ['Gondavale', 'गोंदवले'], ['Shingnapur', 'शिंगणापूर'], ['Bidal', 'बिदाल']]],
      ['Patan', 'पाटण', -0.31, -0.11, [['Patan', 'पाटण'], ['Koynanagar', 'कोयनानगर'], ['Malharpeth', 'मल्हारपेठ'], ['Marul', 'मरुल'], ['Dhebewadi', 'ढेबेवाडी']]],
      ['Jaoli', 'जावळी', 0.10, -0.15, [['Medha', 'मेढा'], ['Kudal', 'कुडाळ'], ['Humgaon', 'हुमगाव'], ['Bamnoil', 'बामणोली']]],
    ]),
  },
  {
    id: 'sangli',
    nameEn: 'Sangli',
    nameMr: 'सांगली',
    nameHi: 'सांगली',
    division: 'Pune',
    lat: 16.8524,
    lng: 74.5815,
    talukas: buildTalukas('sangli', 16.8524, 74.5815, [
      ['Miraj', 'मिरज', -0.03, 0.07, [['Tasgaon Road', 'तासगाव रोड'], ['Miraj', 'मिरज'], ['Sangli', 'सांगली'], ['Budhgaon', 'बुधगाव'], ['Kavalapur', 'कवलापूर'], ['Mhaishal', 'म्हैसाळ'], ['Arag', 'आरग']]],
      ['Tasgaon', 'तासगाव', 0.18, 0.02, [['Tasgaon', 'तासगाव'], ['Savalaj', 'सावळज'], ['Manerajuri', 'मणेराजुरी'], ['Visapur', 'विसापूर'], ['Nagaon', 'नागाव']]],
      ['Walwa (Islampur)', 'वाळवा (इस्लामपूर)', 0.20, -0.32, [['Islampur', 'इस्लामपूर'], ['Walwa', 'वाळवा'], ['Ashta', 'आष्टा'], ['Kasegaon', 'कासेगाव'], ['Kameri', 'कामेरी'], ['Takari', 'ताकारी']]],
      ['Palus', 'पलूस', 0.24, -0.13, [['Palus', 'पलूस'], ['Kundal', 'कुंडल'], ['Kirloskarwadi', 'किर्लोस्करवाडी'], ['Bhilawadi', 'भिलवडी'], ['Audumbar', 'औदुंबर']]],
      ['Kadegaon', 'कडेगाव', 0.43, -0.22, [['Kadegaon', 'कडेगाव'], ['Kadepur', 'कडेपूर'], ['Wangi', 'वांगी'], ['Sonsal', 'सोनसळ'], ['Tondoli', 'तोंडोली']]],
      ['Khanapur (Vita)', 'खानापूर (विटा)', 0.42, -0.05, [['Vita', 'विटा'], ['Khanapur', 'खानापूर'], ['Lengare', 'लेंगरे'], ['Bhalavani', 'भलवणी'], ['Karve', 'करवे']]],
      ['Atpadi', 'आटपाडी', 0.57, 0.36, [['Atpadi', 'आटपाडी'], ['Dighanchi', 'दिघंची'], ['Kargani', 'करगणी'], ['Kharsundi', 'खरसुंडी']]],
      ['Jat', 'जत', 0.20, 0.64, [['Jat', 'जत'], ['Umadi', 'उमदी'], ['Sankh', 'संख'], ['Madgyal', 'माडग्याळ'], ['Dafalapur', 'डफळापूर']]],
      ['Kavathe Mahankal', 'कवठेमहांकाळ', 0.16, 0.28, [['Kavathe Mahankal', 'कवठेमहांकाळ'], ['Dhalgaon', 'ढालगाव'], ['Arewadi', 'आरेवाडी'], ['Irali', 'इरळी']]],
      ['Shirala', 'शिराळा', 0.13, -0.45, [['Shirala', 'शिराळा'], ['Kokrud', 'कोकरूड'], ['Charan', 'चरण'], ['Sagaon', 'सागाव'], ['Bhatshirgaon', 'भटशिरगाव']]],
    ]),
  },
  {
    id: 'solapur',
    nameEn: 'Solapur',
    nameMr: 'सोलापूर',
    nameHi: 'सोलापुर',
    division: 'Pune',
    lat: 17.6599,
    lng: 75.9064,
    talukas: buildTalukas('solapur', 17.6599, 75.9064, [
      ['Pandharpur', 'पंढरपूर', 0.01, -0.58, [['Karkamb', 'करकंब'], ['Pandharpur', 'पंढरपूर'], ['Bhandishegaon', 'भांडीशेगाव'], ['Kasegaon', 'कासेगाव'], ['Wakhari', 'वाखरी'], ['Takali', 'टाकळी']]],
      ['Malshiras', 'माळशिरस', 0.21, -0.99, [['Malshiras', 'माळशिरस'], ['Akluj', 'अकलूज'], ['Natepute', 'नातेपुते'], ['Velapur', 'वेळापूर'], ['Mhaswad Road', 'म्हसवड रोड'], ['Sadashivnagar', 'सदाशिवनगर']]],
      ['Sangola', 'सांगोला', -0.23, -0.71, [['Sangola', 'सांगोला'], ['Jawale', 'जवळा'], ['Kadlas', 'कडलास'], ['Nazare', 'नझरे'], ['Mahud', 'महूद']]],
      ['Mangalvedhe', 'मंगळवेढा', -0.15, -0.46, [['Mangalvedhe', 'मंगळवेढा'], ['Marwade', 'मरवडे'], ['Huljanti', 'हुलजंती'], ['Bhalawani', 'भलवणी']]],
      ['Mohol', 'मोहोळ', 0.15, -0.27, [['Mohol', 'मोहोळ'], ['Kamti', 'कामती'], ['Anagar', 'अनगर'], ['Kurul', 'कुरूल'], ['Penur', 'पेनूर']]],
      ['Madha', 'माढा', 0.36, -0.40, [['Madha', 'माढा'], ['Kurduwadi', 'कुर्डुवाडी'], ['Tembhurni', 'टेंभुर्णी'], ['Modnimb', 'मोडनिंब'], ['Bembale', 'बेंबळे']]],
      ['Karmala', 'करमाळा', 0.74, -0.71, [['Karmala', 'करमाळा'], ['Jeur', 'जेऊर'], ['Kem', 'केम'], ['Pande', 'पांडे'], ['Shetphal', 'शेटफळ']]],
      ['Barshi', 'बार्शी', 0.57, -0.21, [['Barshi', 'बार्शी'], ['Vairag', 'वैराग'], ['Pangri', 'पांगरी'], ['Pangaon', 'पानगाव'], ['Agalgaon', 'आगळगाव']]],
      ['Solapur North', 'उत्तर सोलापूर', 0.03, 0.01, [['Solapur', 'सोलापूर'], ['Bale', 'बाळे'], ['Shelgi', 'शेळगी'], ['Nannaj', 'नान्नज'], ['Mardi', 'मार्डी']]],
      ['Solapur South', 'दक्षिण सोलापूर', -0.08, -0.02, [['Mandraup', 'मंदूप'], ['Hotgi', 'होतगी'], ['Kumbhari', 'कुंभारी'], ['Boramani', 'बोरामणी'], ['Vangi', 'वांगी']]],
      ['Akkalkot', 'अक्कलकोट', -0.14, 0.30, [['Akkalkot', 'अक्कलकोट'], ['Dudhani', 'दुधनी'], ['Maindargi', 'मैंदर्गी'], ['Chapalgaon', 'चपळगाव'], ['Waghdari', 'वाघदरी']]],
    ]),
  },
  {
    id: 'kolhapur',
    nameEn: 'Kolhapur',
    nameMr: 'कोल्हापूर',
    nameHi: 'कोल्हापुर',
    division: 'Pune',
    lat: 16.7050,
    lng: 74.2433,
    talukas: buildTalukas('kolhapur', 16.7050, 74.2433, [
      ['Shirol', 'शिरोळ', 0.03, 0.36, [['Jaysingpur', 'जयसिंगपूर'], ['Shirol', 'शिरोळ'], ['Kurundwad', 'कुरुंदवाड'], ['Dattawad', 'दत्तवाड'], ['Nandani', 'नांदणी'], ['Danoli', 'दानोळी']]],
      ['Hatkanangale', 'हातकणंगले', 0.04, 0.19, [['Hatkanangale', 'हातकणंगले'], ['Ichalkaranji', 'इचलकरंजी'], ['Peth Vadgaon', 'पेठ वडगाव'], ['Rukadi', 'रुकडी'], ['Pattankodoli', 'पट्टणकोडोली'], ['Hupari', 'हुपरी']]],
      ['Karvir', 'करवीर', 0, 0, [['Kolhapur', 'कोल्हापूर'], ['Shiroli', 'शिरोली'], ['Vathar', 'वाठार'], ['Sangrul', 'सांगरुळ'], ['Kuditre', 'कुडित्रे'], ['Haldi', 'हळदी']]],
      ['Panhala', 'पन्हाळा', 0.11, -0.13, [['Panhala', 'पन्हाळा'], ['Kodoli', 'कोडोली'], ['Warananagar', 'वारणानगर'], ['Kale', 'काळे'], ['Kotoli', 'कोतोली']]],
      ['Shahuwadi', 'शाहूवाडी', 0.21, -0.31, [['Malkapur', 'मलकापूर'], ['Shahuwadi', 'शाहूवाडी'], ['Bambawade', 'बांबवडे'], ['Sarud', 'सरूड'], ['Amba', 'आंबा']]],
      ['Kagal', 'कागल', -0.13, 0.07, [['Kagal', 'कागल'], ['Murgud', 'मुरगूड'], ['Kapashi', 'कापशी'], ['Sangaon', 'सांगाव'], ['Hamidwada', 'हमीदवाडा']]],
      ['Radhanagari', 'राधानगरी', -0.30, -0.25, [['Radhanagari', 'राधानगरी'], ['Sarawade', 'सरवडे'], ['Dhamod', 'धामोड'], ['Rashiwade', 'राशीवडे'], ['Solankur', 'सोलंकूर']]],
      ['Gaganbawada', 'गगनबावडा', -0.16, -0.41, [['Gaganbawada', 'गगनबावडा'], ['Asalaj', 'असळज'], ['Tisangi', 'तिसंगी'], ['Mandukali', 'मांडुकली']]],
      ['Bhudargad', 'भुदरगड', -0.44, -0.15, [['Gargoti', 'गारगोटी'], ['Kadgaon', 'कडगाव'], ['Madilage', 'मडिलगे'], ['Pushpagiri', 'पुष्पगिरी']]],
      ['Gadhinglaj', 'गडहिंग्लज', -0.48, 0.11, [['Gadhinglaj', 'गडहिंग्लज'], ['Nesari', 'नेसरी'], ['Halkarni', 'हलकर्णी'], ['Nool', 'नूल'], ['Koulage', 'कौलगे']]],
      ['Chandgad', 'चंदगड', -0.76, -0.04, [['Chandgad', 'चंदगड'], ['Halkarni', 'हलकर्णी'], ['Kowad', 'कोवाड'], ['Nesari Road', 'नेसरी रोड'], ['Turukwadi', 'तुरकवाडी']]],
      ['Ajara', 'आजरा', -0.59, -0.04, [['Ajara', 'आजरा'], ['Uttur', 'उत्तूर'], ['Watangi', 'वाटंगी'], ['Gawase', 'गवसे']]],
    ]),
  },

  // ==================== NASHIK DIVISION ====================
  {
    id: 'nashik',
    nameEn: 'Nashik',
    nameMr: 'नाशिक',
    nameHi: 'नासिक',
    division: 'Nashik',
    lat: 19.9975,
    lng: 73.7898,
    talukas: buildTalukas('nashik', 19.9975, 73.7898, [
      ['Niphad', 'निफाड', 0.08, 0.31, [['Pimpalgaon Baswant', 'पिंपळगाव बसवंत'], ['Niphad', 'निफाड'], ['Ozar', 'ओझर'], ['Lasalgaon', 'लासलगाव'], ['Saykheda', 'सायखेडा'], ['Ugaon', 'उगाव'], ['Chandori', 'चांदोरी']]],
      ['Nashik', 'नाशिक', 0, 0, [['Nashik', 'नाशिक'], ['Deolali', 'देवळाली'], ['Makhmalabad', 'मखमलाबाद'], ['Adgaon', 'आडगाव'], ['Girnare', 'गिरणारे'], ['Mhasrul', 'म्हसरूळ']]],
      ['Dindori', 'दिंडोरी', 0.20, 0.05, [['Dindori', 'दिंडोरी'], ['Vani', 'वणी'], ['Khedgaon', 'खेडगाव'], ['Mohadi', 'मोहाडी'], ['Janori', 'जानोरी']]],
      ['Sinnar', 'सिन्नर', -0.15, 0.21, [['Sinnar', 'सिन्नर'], ['Musalgaon', 'मुसळगाव'], ['Ghoti Road', 'घोटी रोड'], ['Wavi', 'वावी'], ['Pangri', 'पांगरी']]],
      ['Igatpuri', 'इगतपुरी', -0.30, -0.23, [['Igatpuri', 'इगतपुरी'], ['Ghoti', 'घोटी'], ['Taked', 'टाकेद'], ['Wadivarhe', 'वाडीवऱ्हे']]],
      ['Trimbakeshwar', 'त्र्यंबकेश्वर', -0.06, -0.26, [['Trimbakeshwar', 'त्र्यंबकेश्वर'], ['Anjaneri', 'अंजनेरी'], ['Harsul', 'हरसूल'], ['Brahmagiri', 'ब्रह्मगिरी']]],
      ['Peth', 'पेठ', 0.25, -0.28, [['Peth', 'पेठ'], ['Karanjali', 'करंजाळी'], ['Umbarthan', 'उंबरठाण'], ['Jogmodi', 'जोगमोडी']]],
      ['Surgana', 'सुरगाणा', 0.57, -0.18, [['Surgana', 'सुरगाणा'], ['Borgaon', 'बोरगाव'], ['Umbarpada', 'उंबरपाडा'], ['Barhe', 'बाऱ्हे']]],
      ['Kalwan', 'कळवण', 0.49, 0.24, [['Kalwan', 'कळवण'], ['Abhona', 'अभोणा'], ['Deola Road', 'देवळा रोड'], ['Bej', 'बेज']]],
      ['Deola', 'देवळा', 0.46, 0.43, [['Deola', 'देवळा'], ['Umrane', 'उमराणे'], ['Lohoner', 'लोहोणेर'], ['Khamkheda', 'खामखेडा']]],
      ['Baglan (Satana)', 'बागलाण (सटाणा)', 0.60, 0.42, [['Satana', 'सटाणा'], ['Nampur', 'नामपूर'], ['Taharabad', 'ताहाराबाद'], ['Jaykheda', 'जायखेडा'], ['Mulher', 'मुल्हेर']]],
      ['Malegaon', 'मालेगाव', 0.56, 0.74, [['Malegaon', 'मालेगाव'], ['Dabhadi', 'दाभाडी'], ['Zodge', 'झोडगे'], ['Umrane', 'उमराणे'], ['Soygaon', 'सोयगाव']]],
      ['Nandgaon', 'नांदगाव', 0.31, 0.91, [['Nandgaon', 'नांदगाव'], ['Manmad', 'मनमाड'], ['Bolthan', 'बोलठाण'], ['Nyaydongri', 'न्यायडोंगरी']]],
      ['Chandwad', 'चांदवड', 0.33, 0.45, [['Chandwad', 'चांदवड'], ['Wadali Bhoi', 'वडाळी भोई'], ['Raipur', 'रायपूर'], ['Shingave', 'शिंगवे']]],
      ['Yeola', 'येवला', 0.04, 0.70, [['Yeola', 'येवला'], ['Andarsul', 'अंदरसूल'], ['Nagarsul', 'नगरसूल'], ['Patoda', 'पाटोदा'], ['Mukhed', 'मुखेड']]],
    ]),
  },
  {
    id: 'dhule',
    nameEn: 'Dhule',
    nameMr: 'धुळे',
    nameHi: 'धुले',
    division: 'Nashik',
    lat: 20.9042,
    lng: 74.7749,
    talukas: buildTalukas('dhule', 20.9042, 74.7749, [
      ['Dhule', 'धुळे', 0, 0, [['Dhule', 'धुळे'], ['Songir', 'सोनगीर'], ['Kusumba', 'कुसुंबा'], ['Fagne', 'फागणे'], ['Ner', 'नेर'], ['Nagaon', 'नागाव']]],
      ['Sakri', 'साक्री', 0.04, -0.45, [['Sakri', 'साक्री'], ['Pimpalner', 'पिंपळनेर'], ['Nizampur', 'निजामपूर'], ['Bhadne', 'भडणे'], ['Dahiwel', 'दहिवेल']]],
      ['Shirpur', 'शिरपूर', 0.45, 0.10, [['Shirpur', 'शिरपूर'], ['Thalner', 'थाळनेर'], ['Boradi', 'बोराडी'], ['Sangvi', 'सांगवी'], ['Karvand', 'करवंद']]],
      ['Shindkheda', 'शिंदखेडा', 0.36, -0.10, [['Shindkheda', 'शिंदखेडा'], ['Dondaicha', 'दोंडाईचा'], ['Nardana', 'नरडाणा'], ['Betawad', 'बेटावद'], ['Chimthane', 'चिमठाणे']]],
    ]),
  },
  {
    id: 'nandurbar',
    nameEn: 'Nandurbar',
    nameMr: 'नंदुरबार',
    nameHi: 'नंदुरबार',
    division: 'Nashik',
    lat: 21.3702,
    lng: 74.2409,
    talukas: buildTalukas('nandurbar', 21.3702, 74.2409, [
      ['Nandurbar', 'नंदुरबार', 0, 0, [['Nandurbar', 'नंदुरबार'], ['Ranala', 'रनाळा'], ['Koparli', 'कोपर्ली'], ['Korit', 'कोरीट'], ['Dhanora', 'धानोरा']]],
      ['Shahada', 'शहादा', 0.17, 0.23, [['Shahada', 'शहादा'], ['Prakasha', 'प्रकाशा'], ['Dondaicha Road', 'दोंडाईचा रोड'], ['Sarangkheda', 'सारंगखेडा'], ['Mhasavad', 'म्हसावद']]],
      ['Talode', 'तळोदा', 0.20, -0.03, [['Talode', 'तळोदा'], ['Borad', 'बोरद'], ['Chandsaili', 'चांदसैली'], ['Pratappur', 'प्रतापपूर']]],
      ['Navapur', 'नवापूर', -0.21, -0.45, [['Navapur', 'नवापूर'], ['Chinchpada', 'चिंचपाडा'], ['Visarwadi', 'विसरवाडी'], ['Khandbara', 'खांडबारा']]],
      ['Akkalkuwa', 'अक्कलकुवा', 0.17, -0.23, [['Akkalkuwa', 'अक्कलकुवा'], ['Molgi', 'मोलगी'], ['Khapar', 'खापर'], ['Moramba', 'मोरंबा']]],
      ['Akrani (Dhadgaon)', 'अक्राणी (धडगाव)', 0.45, -0.02, [['Dhadgaon', 'धडगाव'], ['Toranmal', 'तोरणमाळ'], ['Mandvi', 'मांडवी'], ['Roshmal', 'रोषमाळ']]],
    ]),
  },
  {
    id: 'jalgaon',
    nameEn: 'Jalgaon',
    nameMr: 'जळगाव',
    nameHi: 'जलगांव',
    division: 'Nashik',
    lat: 21.0077,
    lng: 75.5626,
    talukas: buildTalukas('jalgaon', 21.0077, 75.5626, [
      ['Jalgaon', 'जळगाव', 0, 0, [['Jalgaon', 'जळगाव'], ['Nashirabad', 'नशिराबाद'], ['Asoda', 'आसोदा'], ['Mhasawad', 'म्हसावद'], ['Shirsoli', 'शिरसोली']]],
      ['Bhusawal', 'भुसावळ', 0.04, 0.22, [['Bhusawal', 'भुसावळ'], ['Varangaon', 'वरणगाव'], ['Sakegaon', 'साकेगाव'], ['Khadka', 'खडका']]],
      ['Yawal', 'यावल', 0.16, 0.13, [['Yawal', 'यावल'], ['Faizpur', 'फैजपूर'], ['Kingaon', 'किनगाव'], ['Bhalod', 'भालोद'], ['Sawkheda', 'सावखेडा']]],
      ['Raver', 'रावेर', 0.24, 0.47, [['Raver', 'रावेर'], ['Savda', 'सावदा'], ['Khirdi', 'खिर्डी'], ['Nimbhora', 'निंभोरा'], ['Chinawal', 'चिनावल']]],
      ['Muktainagar', 'मुक्ताईनगर', 0.04, 0.50, [['Muktainagar', 'मुक्ताईनगर'], ['Kurha', 'कुऱ्हा'], ['Anturli', 'अंतूर्ली'], ['Changdev', 'चांगदेव']]],
      ['Bodwad', 'बोदवड', -0.12, 0.42, [['Bodwad', 'बोदवड'], ['Nadgaon', 'नाडगाव'], ['Shegaon', 'शेगाव'], ['Salshingi', 'सालशिंगी']]],
      ['Jamner', 'जामनेर', -0.20, 0.22, [['Jamner', 'जामनेर'], ['Pahur', 'पहूर'], ['Shendurni', 'शेंदुर्णी'], ['Fattepur', 'फत्तेपूर'], ['Wakadi', 'वाकडी']]],
      ['Pachora', 'पाचोरा', -0.34, -0.21, [['Pachora', 'पाचोरा'], ['Nandra', 'नांद्रा'], ['Bhadgaon Road', 'भडगाव रोड'], ['Lohara', 'लोहारा']]],
      ['Chalisgaon', 'चाळीसगाव', -0.54, -0.56, [['Chalisgaon', 'चाळीसगाव'], ['Mehunbare', 'मेहुणबारे'], ['Patnadevi', 'पाटणादेवी'], ['Bhoras', 'भोरस'], ['Bahal', 'बहाळ']]],
      ['Bhadgaon', 'भडगाव', -0.34, -0.33, [['Bhadgaon', 'भडगाव'], ['Kajgaon', 'कजगाव'], ['Gondgaon', 'गोंडगाव'], ['Amadade', 'आमडदे']]],
      ['Parola', 'पारोळा', -0.13, -0.45, [['Parola', 'पारोळा'], ['Bahadarpur', 'बहादरपूर'], ['Tamaswadi', 'तामसवाडी'], ['Shelave', 'शेलवे']]],
      ['Erandol', 'एरंडोल', -0.08, -0.23, [['Erandol', 'एरंडोल'], ['Kasoda', 'कासोदा'], ['Pimpri', 'पिंपरी'], ['Utran', 'उत्राण']]],
      ['Dharangaon', 'धरणगाव', 0.01, -0.29, [['Dharangaon', 'धरणगाव'], ['Paldhi', 'पाळधी'], ['Sonwad', 'सोनवड'], ['Chandsar', 'चांदसर']]],
      ['Amalner', 'अमळनेर', 0.04, -0.50, [['Amalner', 'अमळनेर'], ['Marwad', 'मारवड'], ['Patonda', 'पातोंडा'], ['Mangrul', 'मंगरूळ']]],
      ['Chopda', 'चोपडा', 0.24, -0.27, [['Chopda', 'चोपडा'], ['Adavad', 'अडावद'], ['Lasur', 'लासूर'], ['Dhanora', 'धानोरा'], ['Goradkheda', 'गोरडखेडा']]],
    ]),
  },
  {
    id: 'ahilyanagar',
    nameEn: 'Ahilyanagar (Ahmednagar)',
    nameMr: 'अहिल्यानगर (अहमदनगर)',
    nameHi: 'अहिल्यानगर (अहमदनगर)',
    division: 'Nashik',
    lat: 19.0948,
    lng: 74.7480,
    talukas: buildTalukas('ahilyanagar', 19.0948, 74.7480, [
      ['Rahuri', 'राहुरी', 0.30, -0.10, [['Rahuri Factory', 'राहुरी फॅक्टरी'], ['Rahuri', 'राहुरी'], ['Deolali Pravara', 'देवळाली प्रवरा'], ['Vambori', 'वांबोरी'], ['Taklimiya', 'टाकळीमिया'], ['Baragaon Nandur', 'बारागाव नांदूर']]],
      ['Nagar', 'नगर', 0, 0, [['Ahilyanagar', 'अहिल्यानगर'], ['Kedgaon', 'केडगाव'], ['Bhingar', 'भिंगार'], ['Nagapur', 'नागापूर'], ['Jeur', 'जेऊर'], ['Chichondi Patil', 'चिचोंडी पाटील']]],
      ['Shrirampur', 'श्रीरामपूर', 0.52, -0.09, [['Shrirampur', 'श्रीरामपूर'], ['Belapur', 'बेलापूर'], ['Haregaon', 'हरेगाव'], ['Ukkhalgaon', 'उक्कलगाव'], ['Takalibhan', 'टाकळीभान']]],
      ['Rahata', 'राहाता', 0.62, -0.27, [['Rahata', 'राहाता'], ['Shirdi', 'शिर्डी'], ['Loni', 'लोणी'], ['Pravaranagar', 'प्रवरानगर'], ['Babhaleshwar', 'बाभळेश्वर'], ['Puntamba', 'पुणतांबा']]],
      ['Kopargaon', 'कोपरगाव', 0.79, -0.26, [['Kopargaon', 'कोपरगाव'], ['Sanjeevani', 'संजीवनी'], ['Pohegaon', 'पोहेगाव'], ['Kumbhari', 'कुंभारी'], ['Suregaon', 'सुरेगाव']]],
      ['Sangamner', 'संगमनेर', 0.47, -0.54, [['Sangamner', 'संगमनेर'], ['Ghulewadi', 'घुलेवाडी'], ['Ashwi', 'आश्वी'], ['Talegaon Dighe', 'तळेगाव दिघे'], ['Sakur', 'साकूर']]],
      ['Akole', 'अकोले', 0.45, -0.74, [['Akole', 'अकोले'], ['Rajur', 'राजूर'], ['Kotul', 'कोतूळ'], ['Samsherpur', 'समशेरपूर'], ['Bhandardara', 'भंडारदरा']]],
      ['Newasa', 'नेवासा', 0.46, 0.18, [['Newasa', 'नेवासा'], ['Bhenda', 'भेंडा'], ['Kukana', 'कुकाणा'], ['Sonai', 'सोनई'], ['Shani Shingnapur', 'शनि शिंगणापूर'], ['Ghogargaon', 'घोगरगाव']]],
      ['Shevgaon', 'शेवगाव', 0.25, 0.47, [['Shevgaon', 'शेवगाव'], ['Bodhegaon', 'बोधेगाव'], ['Chapadgaon', 'चापडगाव'], ['Erandgaon', 'एरंडगाव']]],
      ['Pathardi', 'पाथर्डी', 0.08, 0.43, [['Pathardi', 'पाथर्डी'], ['Tisgaon', 'तिसगाव'], ['Kharwandi', 'खरवंडी'], ['Madhi', 'मढी'], ['Karanji', 'करंजी']]],
      ['Parner', 'पारनेर', -0.09, -0.31, [['Parner', 'पारनेर'], ['Supa', 'सुपा'], ['Takli Dhokeshwar', 'टाकळी ढोकेश्वर'], ['Ralegan Siddhi', 'राळेगण सिद्धी'], ['Alkuti', 'अळकुटी']]],
      ['Shrigonda', 'श्रीगोंदा', -0.48, -0.05, [['Shrigonda', 'श्रीगोंदा'], ['Belwandi', 'बेलवंडी'], ['Kashti', 'काष्टी'], ['Madhewadgaon', 'माढेवडगाव'], ['Pedgaon', 'पेडगाव']]],
      ['Karjat', 'कर्जत', -0.54, 0.26, [['Karjat', 'कर्जत'], ['Rashin', 'राशीन'], ['Mirajgaon', 'मिरजगाव'], ['Khed', 'खेड'], ['Koregaon', 'कोरेगाव']]],
      ['Jamkhed', 'जामखेड', -0.36, 0.75, [['Jamkhed', 'जामखेड'], ['Kharda', 'खर्डा'], ['Aron', 'अरणगाव'], ['Nannaj', 'नान्नज'], ['Jawala', 'जवळा']]],
    ]),
  },

  // ==================== CHH. SAMBHAJINAGAR (MARATHWADA) DIVISION ====================
  {
    id: 'chh-sambhajinagar',
    nameEn: 'Chh. Sambhajinagar',
    nameMr: 'छत्रपती संभाजीनगर',
    nameHi: 'छत्रपती संभाजीनगर',
    division: 'Chh. Sambhajinagar',
    lat: 19.8762,
    lng: 75.3433,
    talukas: buildTalukas('chh-sambhajinagar', 19.8762, 75.3433, [
      ['Paithan', 'पैठण', -0.40, 0.04, [['Bidkin', 'बिडकीन'], ['Paithan', 'पैठण'], ['Pachod', 'पाचोड'], ['Dhorkin', 'ढोरकीन'], ['Vihamandwa', 'विहामांडवा'], ['Aduul', 'आडूळ']]],
      ['Chh. Sambhajinagar', 'छत्रपती संभाजीनगर', 0, 0, [['Waluj', 'वाळूज'], ['Chikalthana', 'चिकलठाणा'], ['Shendra', 'शेंद्रा'], ['Karmad', 'करमाड'], ['Pimpri Raja', 'पिंपरी राजा']]],
      ['Gangapur', 'गंगापूर', -0.18, -0.33, [['Gangapur', 'गंगापूर'], ['Lasur Station', 'लासूर स्टेशन'], ['Silegaon', 'शिलेगाव'], ['Bhendala', 'भेंडाळा'], ['Turkabad', 'तुर्काबाद']]],
      ['Vaijapur', 'वैजापूर', 0.09, -0.61, [['Vaijapur', 'वैजापूर'], ['Rotegaon', 'रोटेगाव'], ['Lasoor', 'लासूर'], ['Parsoda', 'परसोडा'], ['Borsar', 'बोरसर']]],
      ['Kannad', 'कन्नड', 0.38, -0.20, [['Kannad', 'कन्नड'], ['Pishor', 'पिशोर'], ['Chincholi', 'चिंचोली'], ['Devgaon Rangari', 'देवगाव रंगारी'], ['Hatnoor', 'हतनूर']]],
      ['Khuldabad', 'खुलताबाद', 0.13, -0.15, [['Khuldabad', 'खुलताबाद'], ['Ellora (Verul)', 'वेरूळ'], ['Bazar Sawangi', 'बाजार सावंगी'], ['Sultapur', 'सुलतानपूर']]],
      ['Phulambri', 'फुलंब्री', 0.20, 0.07, [['Phulambri', 'फुलंब्री'], ['Vadod Bazar', 'वडोद बाजार'], ['Baburao', 'बाभळगाव'], ['Pathri', 'पाथरी']]],
      ['Sillod', 'सिल्लोड', 0.43, 0.31, [['Sillod', 'सिल्लोड'], ['Ajanta', 'अजिंठा'], ['Bharadi', 'भराडी'], ['Undangaon', 'उंडणगाव'], ['Ghatnandra', 'घाटनांद्रा']]],
      ['Soygaon', 'सोयगाव', 0.72, 0.30, [['Soygaon', 'सोयगाव'], ['Fardapur', 'फर्दापूर'], ['Banoti', 'बनोट', ], ['Gondegaon', 'गोंदेगाव']]],
    ]),
  },
  {
    id: 'jalna',
    nameEn: 'Jalna',
    nameMr: 'जालना',
    nameHi: 'जालना',
    division: 'Chh. Sambhajinagar',
    lat: 19.8347,
    lng: 75.8816,
    talukas: buildTalukas('jalna', 19.8347, 75.8816, [
      ['Jalna', 'जालना', 0, 0, [['Jalna', 'जालना'], ['Nagewadi', 'नागेवाडी'], ['Ramnagar', 'रामनगर'], ['Ner', 'नेर'], ['Waghrool', 'वाघ्रूळ']]],
      ['Badnapur', 'बदनापूर', 0.03, -0.17, [['Badnapur', 'बदनापूर'], ['Shelgaon', 'शेलगाव'], ['Dabhadi', 'दाभाडी'], ['Somthana', 'सोमठाणा']]],
      ['Bhokardan', 'भोकरदन', 0.43, -0.10, [['Bhokardan', 'भोकरदन'], ['Rajur', 'राजूर'], ['Hasnabad', 'हसनाबाद'], ['Paradh', 'पारध'], ['Anwa', 'आन्वा']]],
      ['Jafrabad', 'जाफराबाद', 0.37, 0.13, [['Jafrabad', 'जाफराबाद'], ['Tembhurni', 'टेंभुर्णी'], ['Mahora', 'माहोरा'], ['Kumbharzari', 'कुंभारझरी']]],
      ['Ambad', 'अंबड', -0.22, -0.09, [['Ambad', 'अंबड'], ['Wadigodri', 'वडीगोद्री'], ['Gondhi', 'गोंदी'], ['Shahagad', 'शहागड'], ['Sukhpuri', 'सुखपुरी']]],
      ['Ghansawangi', 'घनसावंगी', -0.31, 0.12, [['Ghansawangi', 'घनसावंगी'], ['Kumbhar Pimpalgaon', 'कुंभार पिंपळगाव'], ['Rani Unchegaon', 'राणी उंचेगाव'], ['Tirthpuri', 'तीर्थपुरी']]],
      ['Partur', 'परतूर', -0.25, 0.34, [['Partur', 'परतूर'], ['Ashti', 'आष्टी'], ['Satona', 'सातोना'], ['Watur', 'वाटूर']]],
      ['Mantha', 'मंठा', -0.17, 0.48, [['Mantha', 'मंठा'], ['Talni', 'तळणी'], ['Deogaon Kh', 'देवगाव खु.'], ['Pangri', 'पांगरी']]],
    ]),
  },
  {
    id: 'beed',
    nameEn: 'Beed',
    nameMr: 'बीड',
    nameHi: 'बीड',
    division: 'Chh. Sambhajinagar',
    lat: 18.9891,
    lng: 75.7601,
    talukas: buildTalukas('beed', 18.9891, 75.7601, [
      ['Beed', 'बीड', 0, 0, [['Beed', 'बीड'], ['Pali', 'पाली'], ['Neknoor', 'नेकनूर'], ['Chausala', 'चौसाळा'], ['Limbaganesh', 'लिंबागणेश']]],
      ['Georai', 'गेवराई', 0.27, -0.01, [['Georai', 'गेवराई'], ['Talwada', 'तलवाडा'], ['Umapur', 'उमापूर'], ['Chaklamba', 'चकलांबा'], ['Gadhi', 'गढी']]],
      ['Majalgaon', 'माजलगाव', 0.16, 0.45, [['Majalgaon', 'माजलगाव'], ['Kitti Adgaon', 'किट्टी आडगाव'], ['Dindrud', 'दिंद्रुड'], ['Nitrud', 'निटरुड'], ['Gangamasla', 'गंगामसला']]],
      ['Wadwani', 'वडवणी', -0.01, 0.27, [['Wadwani', 'वडवणी'], ['Kaudgaon', 'कौडगाव'], ['Chinchwan', 'चिंचवण'], ['Upali', 'उपळी']]],
      ['Dharur', 'धारूर', -0.17, 0.35, [['Dharur', 'धारूर'], ['Mohkhed', 'मोहखेड'], ['Telgaon', 'तेलगाव'], ['Aasardoh', 'आसरडोह']]],
      ['Kaij', 'केज', -0.27, 0.31, [['Kaij', 'केज'], ['Yusuf Wadgaon', 'युसूफ वडगाव'], ['Nandurghat', 'नांदूरघाट'], ['Hol', 'होळ'], ['Bansarola', 'बनसारोळा']]],
      ['Ambajogai', 'अंबेजोगाई', -0.25, 0.62, [['Ambajogai', 'अंबेजोगाई'], ['Ghatnandur', 'घाटनांदूर'], ['Bardapur', 'बर्दापूर'], ['Patti Wadgaon', 'पट्टी वडगाव']]],
      ['Parli', 'परळी वैजनाथ', -0.14, 0.77, [['Parli Vaijnath', 'परळी वैजनाथ'], ['Sirsala', 'सिरसाळा'], ['Dharmapuri', 'धर्मापुरी'], ['Tokwadi', 'टोकवाडी']]],
      ['Patoda', 'पाटोदा', -0.19, -0.28, [['Patoda', 'पाटोदा'], ['Amalner', 'अमळनेर'], ['Dasakhed', 'दासखेड'], ['Therla', 'थेरला']]],
      ['Ashti', 'आष्टी', -0.18, -0.58, [['Ashti', 'आष्टी'], ['Kada', 'कडा'], ['Dhamangaon', 'धामणगाव'], ['Pimpri Ghata', 'पिंपरी घाटा']]],
      ['Shirur (Kasar)', 'शिरूर (कासार)', 0.10, -0.35, [['Shirur Kasar', 'शिरूर कासार'], ['Raimoha', 'रायमोहा'], ['Chinchpur', 'चिंचपूर'], ['Bramhagaon', 'ब्रह्मगाव']]],
    ]),
  },
  {
    id: 'latur',
    nameEn: 'Latur',
    nameMr: 'लातूर',
    nameHi: 'लातूर',
    division: 'Chh. Sambhajinagar',
    lat: 18.4088,
    lng: 76.5604,
    talukas: buildTalukas('latur', 18.4088, 76.5604, [
      ['Latur', 'लातूर', 0, 0, [['Ausa Road', 'औसा रोड'], ['Latur', 'लातूर'], ['Babhulgaon', 'बाभुळगाव'], ['Muruud', 'मुरूड'], ['Gategaon', 'गातेगाव'], ['Harangul', 'हरंगुळ']]],
      ['Ausa', 'औसा', -0.16, -0.06, [['Ausa', 'औसा'], ['Killari', 'किल्लारी'], ['Lamjana', 'लामजना'], ['Belkund', 'बेलकुंड'], ['Bhada', 'भादा']]],
      ['Renapur', 'रेणापूर', 0.22, 0.02, [['Renapur', 'रेणापूर'], ['Pangaon', 'पानगाव'], ['Poharegaon', 'पोहरेगाव'], ['Kamkheda', 'कामखेडा']]],
      ['Chakur', 'चाकूर', 0.13, 0.34, [['Chakur', 'चाकूर'], ['Wadwal Nagnath', 'वडवळ नागनाथ'], ['Nalegaon', 'नालेगाव'], ['Chapoli', 'चापोली']]],
      ['Ahmadpur', 'अहमदपूर', 0.30, 0.37, [['Ahmadpur', 'अहमदपूर'], ['Kingaon', 'किनगाव'], ['Shirur Tajband', 'शिरूर ताजबंद'], ['Andhori', 'अंधोरी']]],
      ['Jalkot', 'जळकोट', 0.25, 0.56, [['Jalkot', 'जळकोट'], ['Ghogargaon', 'घोगरगाव'], ['Wanjarwadi', 'वंजारवाडी'], ['Tiruka', 'तिरका']]],
      ['Udgir', 'उदगीर', -0.01, 0.56, [['Udgir', 'उदगीर'], ['Devarjan', 'देवरजन'], ['Lohara', 'लोहारा'], ['Nalgir', 'नलगीर'], ['Malkapur', 'मलकापूर']]],
      ['Deoni', 'देवणी', -0.22, 0.45, [['Deoni', 'देवणी'], ['Walandi', 'वलंदी'], ['Borol', 'बोरोळ'], ['Jawalga', 'जवळगा']]],
      ['Nilanga', 'निलंगा', -0.30, 0.19, [['Nilanga', 'निलंगा'], ['Kasar Shirsi', 'कासार शिरसी'], ['Aurad Shahajani', 'औरद शहाजानी'], ['Ambulga', 'अंबुलगा']]],
      ['Shirur Anantpal', 'शिरूर अनंतपाळ', -0.12, 0.23, [['Shirur Anantpal', 'शिरूर अनंतपाळ'], ['Sakol', 'साकोळ'], ['Ujed', 'उजेड'], ['Hisamabad', 'हिसामाबाद']]],
    ]),
  },
  {
    id: 'dharashiv',
    nameEn: 'Dharashiv (Osmanabad)',
    nameMr: 'धाराशिव (उस्मानाबाद)',
    nameHi: 'धाराशिव (उस्मानाबाद)',
    division: 'Chh. Sambhajinagar',
    lat: 18.1856,
    lng: 76.0419,
    talukas: buildTalukas('dharashiv', 18.1856, 76.0419, [
      ['Dharashiv', 'धाराशिव', 0, 0, [['Dharashiv', 'धाराशिव'], ['Ter', 'तेर'], ['Bembli', 'बेंबळी'], ['Dhoki', 'ढोकी'], ['Jagji', 'जगजी']]],
      ['Tuljapur', 'तुळजापूर', -0.17, 0.03, [['Tuljapur', 'तुळजापूर'], ['Naldurg', 'नळदुर्ग'], ['Apsinga', 'आपसिंगा'], ['Itkal', 'इटकळ'], ['Tamalwadi', 'तामलवाडी']]],
      ['Omerga', 'उमरगा', -0.35, 0.58, [['Omerga', 'उमरगा'], ['Murum', 'मुरुम'], ['Dalimb', 'दाळिंब'], ['Yenegur', 'येणेगूर'], ['Madaj', 'माडज']]],
      ['Lohara', 'लोहारा', -0.24, 0.37, [['Lohara', 'लोहारा'], ['Makni', 'माकणी'], ['Sastur', 'सास्तूर'], ['Jevli', 'जेवळी']]],
      ['Kalamb', 'कळंब', 0.38, -0.02, [['Kalamb', 'कळंब'], ['Yermala', 'येरमाळा'], ['Shiradhon', 'शिरढोण'], ['Itkur', 'इटकूर'], ['Moha', 'मोहा']]],
      ['Washi', 'वाशी', 0.44, -0.23, [['Washi', 'वाशी'], ['Pargaon', 'पारगाव'], ['Terkheda', 'तेरखेडा'], ['Mandwa', 'मांडवा']]],
      ['Bhoom', 'भूम', 0.28, -0.40, [['Bhoom', 'भूम'], ['Ieet', 'ईट'], ['Walwad', 'वाळवड'], ['Pakhrood', 'पाखरूड']]],
      ['Paranda', 'परंडा', 0.08, -0.59, [['Paranda', 'परंडा'], ['Sonari', 'सोनारी'], ['Anala', 'आनाळा'], ['Khasgaon', 'खासगाव']]],
    ]),
  },
  {
    id: 'nanded',
    nameEn: 'Nanded',
    nameMr: 'नांदेड',
    nameHi: 'नांदेड',
    division: 'Chh. Sambhajinagar',
    lat: 19.1383,
    lng: 77.3210,
    talukas: buildTalukas('nanded', 19.1383, 77.3210, [
      ['Nanded', 'नांदेड', 0, 0, [['Nanded', 'नांदेड'], ['Wajegaon', 'वाजेगाव'], ['Tuppa', 'तुप्पा'], ['Vishnupuri', 'विष्णुपुरी'], ['Limbgaon', 'लिंबगाव']]],
      ['Ardhapur', 'अर्धापूर', 0.14, 0.03, [['Ardhapur', 'अर्धापूर'], ['Barad', 'बारड'], ['Malegaon', 'मालेगाव'], ['Shelgaon', 'शेलगाव']]],
      ['Mudkhed', 'मुदखेड', 0.03, 0.19, [['Mudkhed', 'मुदखेड'], ['Mugat', 'मुगट'], ['Barad', 'बारड'], ['Nijampur', 'निजामपूर']]],
      ['Bhokar', 'भोकर', 0.09, 0.35, [['Bhokar', 'भोकर'], ['Kini', 'किनी'], ['Matul', 'मातूळ'], ['Dorli', 'डोरली']]],
      ['Umri', 'उमरी', -0.07, 0.35, [['Umri', 'उमरी'], ['Gortha', 'गोर्ठा'], ['Sindgi', 'सिंदगी'], ['Bolu', 'बोलू']]],
      ['Loha', 'लोहा', -0.19, -0.21, [['Loha', 'लोहा'], ['Sonkhed', 'सोनखेड'], ['Malakoli', 'माळाकोळी'], ['Kapsi', 'कापसी']]],
      ['Kandhar', 'कंधार', -0.25, -0.14, [['Kandhar', 'कंधार'], ['Bahadurpura', 'बहादूरपुरा'], ['Kurula', 'कुरुळा'], ['Manaspuri', 'मानसपुरी']]],
      ['Hadgaon', 'हादगाव', 0.36, 0.25, [['Hadgaon', 'हादगाव'], ['Tamsa', 'तामसा'], ['Manatha', 'मनाठा'], ['Nivgha', 'निवघा']]],
      ['Himayatnagar', 'हिमायतनगर', 0.28, 0.44, [['Himayatnagar', 'हिमायतनगर'], ['Sarsam', 'सरसम'], ['Jawla', 'जवळा'], ['Pota', 'पोटा']]],
      ['Kinwat', 'किनवट', 0.49, 0.88, [['Kinwat', 'किनवट'], ['Islapur', 'इस्लापूर'], ['Bodhadi', 'बोधडी'], ['Mandvi', 'मांडवी']]],
      ['Mahur', 'माहूर', 0.70, 0.59, [['Mahur', 'माहूर'], ['Wai Bazar', 'वाई बाजार'], ['Sarkhani', 'सरखणी'], ['Wanoja', 'वानोजा']]],
      ['Dharmabad', 'धर्माबाद', -0.24, 0.56, [['Dharmabad', 'धर्माबाद'], ['Karheli', 'करखेली'], ['Babra', 'बाभळी'], ['Atkur', 'आटकूर']]],
      ['Biloli', 'बिलोली', -0.35, 0.40, [['Biloli', 'बिलोली'], ['Kundalwadi', 'कुंडलवाडी'], ['Sagram', 'सग्राम'], ['Adampur', 'आदमपूर']]],
      ['Naigaon (Khairgaon)', 'नायगाव (खैरगाव)', -0.25, 0.20, [['Naigaon', 'नायगाव'], ['Kuntur', 'कुंटूर'], ['Barbada', 'बरबडा'], ['Narsi', 'नरसी']]],
      ['Mukhed', 'मुखेड', -0.44, -0.17, [['Mukhed', 'मुखेड'], ['Jamb', 'जांब'], ['Barhali', 'बारहाळी'], ['Betmogra', 'बेटमोगरा']]],
      ['Degloor', 'देगलूर', -0.59, 0.25, [['Degloor', 'देगलूर'], ['Hanegaon', 'हणेगाव'], ['Shahalapur', 'शहापूर'], ['Markhel', 'मरखेल']]],
    ]),
  },
  {
    id: 'parbhani',
    nameEn: 'Parbhani',
    nameMr: 'परभणी',
    nameHi: 'परभणी',
    division: 'Chh. Sambhajinagar',
    lat: 19.2608,
    lng: 76.7748,
    talukas: buildTalukas('parbhani', 19.2608, 76.7748, [
      ['Parbhani', 'परभणी', 0, 0, [['Parbhani', 'परभणी'], ['Pingali', 'पिंगळी'], ['Zari', 'झरी'], ['Tadkalas', 'ताडकळस'], ['Daithana', 'दैठणा']]],
      ['Jintur', 'जिंतूर', 0.35, -0.09, [['Jintur', 'जिंतूर'], ['Bori', 'बोरी'], ['Yeldari', 'येलदरी'], ['Charthana', 'चारठाणा'], ['Bamni', 'बामणी']]],
      ['Sailu', 'सेलू', 0.20, -0.34, [['Sailu', 'सेलू'], ['Walur', 'वालूर'], ['Deulgaon Gat', 'देऊळगाव गात'], ['Kupta', 'कुप्टा']]],
      ['Manwath', 'मानवत', 0.04, -0.28, [['Manwath', 'मानवत'], ['Kola', 'कोल्हा'], ['Hatnur', 'हतनूर'], ['Rampuri', 'रामपुरी']]],
      ['Pathri', 'पाथरी', -0.01, -0.33, [['Pathri', 'पाथरी'], ['Hadgaon Bk', 'हादगाव बु.'], ['Babhulgaon', 'बाभुळगाव'], ['Kansur', 'कानसूर']]],
      ['Sonpeth', 'सोनपेठ', -0.24, -0.29, [['Sonpeth', 'सोनपेठ'], ['Vitas', 'विटा'], ['Sirsi Bk', 'सिरसी बु.'], ['Khaparkheda', 'खापरखेडा']]],
      ['Gangakhed', 'गंगाखेड', -0.30, -0.02, [['Gangakhed', 'गंगाखेड'], ['Rani Sawargaon', 'राणी सावरगाव'], ['Makhani', 'माखणी'], ['Kodri', 'कोद्री']]],
      ['Palam', 'पालम', -0.28, 0.17, [['Palam', 'पालम'], ['Chatori', 'चाटोरी'], ['Phala', 'फळा'], ['Banwas', 'बनवस']]],
      ['Purna', 'पूर्णा', -0.08, 0.25, [['Purna', 'पूर्णा'], ['Chudawa', 'चुडावा'], ['Tadkalas', 'ताडकळस'], ['Kantheshwar', 'कंठेश्वर']]],
    ]),
  },
  {
    id: 'hingoli',
    nameEn: 'Hingoli',
    nameMr: 'हिंगोली',
    nameHi: 'हिंगोली',
    division: 'Chh. Sambhajinagar',
    lat: 19.7173,
    lng: 77.1494,
    talukas: buildTalukas('hingoli', 19.7173, 77.1494, [
      ['Hingoli', 'हिंगोली', 0, 0, [['Hingoli', 'हिंगोली'], ['Narsi Namdev', 'नरसी नामदेव'], ['Goregaon', 'गोरेगाव'], ['Kendra Bk', 'केंद्र बु.'], ['Sirsam', 'सिरसम']]],
      ['Sengaon', 'सेनगाव', 0.12, -0.28, [['Sengaon', 'सेनगाव'], ['Hatta', 'हट्टा'], ['Pankanhergaon', 'पानकन्हेरगाव'], ['Aundha Road', 'औंढा रोड']]],
      ['Kalamnuri', 'कळमनुरी', -0.04, 0.19, [['Kalamnuri', 'कळमनुरी'], ['Akhada Balapur', 'आखाडा बाळापूर'], ['Dongarkada', 'डोंगरकडा'], ['Waranga', 'वारंगा']]],
      ['Basmath', 'बसमत', -0.39, 0.01, [['Basmath', 'बसमत'], ['Kurunda', 'कुरुंदा'], ['Jawala Bazar', 'जवळा बाजार'], ['Hayatnagar', 'हयातनगर'], ['Girgaon', 'गिरगाव']]],
      ['Aundha Nagnath', 'औंढा नागनाथ', -0.19, -0.12, [['Aundha Nagnath', 'औंढा नागनाथ'], ['Siddheshwar', 'सिद्धेश्वर'], ['Shirad Shahapur', 'शिरड शहापूर'], ['Yehalegaon', 'येहळेगाव']]],
    ]),
  },

  // ==================== AMRAVATI DIVISION ====================
  {
    id: 'buldhana',
    nameEn: 'Buldhana',
    nameMr: 'बुलढाणा',
    nameHi: 'बुलढाणा',
    division: 'Amravati',
    lat: 20.5293,
    lng: 76.1842,
    talukas: buildTalukas('buldhana', 20.5293, 76.1842, [
      ['Buldhana', 'बुलढाणा', 0, 0, [['Buldhana', 'बुलढाणा'], ['Dhad', 'धाड'], ['Mhasala', 'म्हसळा'], ['Raipur', 'रायपूर'], ['Deulghat', 'देऊळघाट']]],
      ['Chikhli', 'चिखली', -0.18, 0.07, [['Chikhli', 'चिखली'], ['Amdapur', 'अमडापूर'], ['Undri', 'उंद्री'], ['Mera', 'मेरा'], ['Khandala', 'खंडाळा']]],
      ['Deulgaon Raja', 'देऊळगाव राजा', -0.51, -0.14, [['Deulgaon Raja', 'देऊळगाव राजा'], ['Deulgaon Mahi', 'देऊळगाव मही'], ['Andhera', 'अंधेरा'], ['Mera Bk', 'मेरा बु.']]],
      ['Sindkhed Raja', 'सिंदखेड राजा', -0.57, -0.04, [['Sindkhed Raja', 'सिंदखेड राजा'], ['Dusarbid', 'दुसरबीड'], ['Kingaon Raja', 'किनगाव राजा'], ['Sakharkherda', 'साखरखेर्डा']]],
      ['Lonar', 'लोणार', -0.55, 0.34, [['Lonar', 'लोणार'], ['Bibi', 'बिबी'], ['Sultanpur', 'सुलतानपूर'], ['Hirdav', 'हिरडव']]],
      ['Mehkar', 'मेहकर', -0.38, 0.39, [['Mehkar', 'मेहकर'], ['Janephal', 'जानेफळ'], ['Dongaon', 'डोणगाव'], ['Anjani Bk', 'अंजनी बु.']]],
      ['Khamgaon', 'खामगाव', 0.18, 0.38, [['Khamgaon', 'खामगाव'], ['Pimpalgaon Raja', 'पिंपळगाव राजा'], ['Sajanpuri', 'साजनपुरी'], ['Amsari', 'आमसाारी']]],
      ['Shegaon', 'शेगाव', 0.26, 0.51, [['Shegaon', 'शेगाव'], ['Matargaon', 'माटरगाव'], ['Jastgaon', 'जास्तगाव'], ['Alasana', 'अळसणा']]],
      ['Nandura', 'नांदुरा', 0.30, 0.24, [['Nandura', 'नांदुरा'], ['Wadner Bholji', 'वडनेर भोलजी'], ['Dighras', 'दिग्रस'], ['Nimgaon', 'निमगाव']]],
      ['Malkapur', 'मलकापूर', 0.36, 0.02, [['Malkapur', 'मलकापूर'], ['Dasarkhed', 'दसरखेड'], ['Datala', 'दाताळा'], ['Wakodi', 'वाकोडी']]],
      ['Motala', 'मोताळा', 0.15, 0.01, [['Motala', 'मोताळा'], ['Dhamangaon Badhe', 'धामणगाव बढे'], ['Rohinkhed', 'रोहिणखेड'], ['Borakhedi', 'बोराखेडी']]],
      ['Jalgaon Jamod', 'जळगाव जामोद', 0.52, 0.35, [['Jalgaon Jamod', 'जळगाव जामोद'], ['Asalgaon', 'आसलगाव'], ['Pimpalgaon Kale', 'पिंपळगाव काळे'], ['Jamod', 'जामोद']]],
      ['Sangrampur', 'संग्रामपूर', 0.51, 0.52, [['Sangrampur', 'संग्रामपूर'], ['Tamgaon', 'तामगाव'], ['Sonala', 'सोनाळा'], ['Patulda', 'पातुर्डा']]],
    ]),
  },
  {
    id: 'akola',
    nameEn: 'Akola',
    nameMr: 'अकोला',
    nameHi: 'अकोला',
    division: 'Amravati',
    lat: 20.7002,
    lng: 77.0082,
    talukas: buildTalukas('akola', 20.7002, 77.0082, [
      ['Akola', 'अकोला', 0, 0, [['Akola', 'अकोला'], ['Borgaon Manju', 'बोरगाव मंजू'], ['Ugaon', 'उगाव'], ['Kapsi', 'कापसी'], ['Shivar', 'शिवार']]],
      ['Akot', 'अकोट', 0.40, 0.05, [['Akot', 'अकोट'], ['Hiwarkhed', 'हिवरखेड'], ['Chohatta', 'चोहट्टा'], ['Popatkhed', 'पोपटखेड'], ['Mundgaon', 'मुंडगाव']]],
      ['Telhara', 'तेल्हारा', 0.33, -0.17, [['Telhara', 'तेल्हारा'], ['Hiwarkhed Ruprao', 'हिवरखेड'], ['Malegaon Bazar', 'मालेगाव बाजार'], ['Danapur', 'दानापूर']]],
      ['Balapur', 'बाळापूर', -0.03, -0.23, [['Balapur', 'बाळापूर'], ['Wadegaon', 'वाडेगाव'], ['Paras', 'पारस'], ['Ural', 'उरळ']]],
      ['Patur', 'पातूर', -0.25, -0.06, [['Patur', 'पातूर'], ['Channi', 'चन्नी'], ['Sasti', 'सास्ती'], ['Alegaon', 'आलेगाव']]],
      ['Barshitakli', 'बार्शीटाकळी', -0.13, 0.14, [['Barshitakli', 'बार्शीटाकळी'], ['Pinjar', 'पिंजर'], ['Mahan', 'महान'], ['Kanzara', 'कांजरा']]],
      ['Murtizapur', 'मूर्तिजापूर', 0.03, 0.35, [['Murtizapur', 'मूर्तिजापूर'], ['Mana', 'माना'], ['Kuruhm', 'कुरुम'], ['Sirso', 'सिरसो']]],
    ]),
  },
  {
    id: 'washim',
    nameEn: 'Washim',
    nameMr: 'वाशिम',
    nameHi: 'वाशिम',
    division: 'Amravati',
    lat: 20.1119,
    lng: 77.1310,
    talukas: buildTalukas('washim', 20.1119, 77.1310, [
      ['Washim', 'वाशिम', 0, 0, [['Washim', 'वाशिम'], ['Ansing', 'अनसिंग'], ['Kata', 'काटा'], ['Tondgaon', 'तोंडगाव'], ['Pardi Takmor', 'पार्डी टकमोर']]],
      ['Risod', 'रिसोड', -0.13, -0.34, [['Risod', 'रिसोड'], ['Kenwad', 'केनवड'], ['Wadji', 'वडजी'], ['Gowardhan', 'गोवर्धन']]],
      ['Malegaon', 'मालेगाव', 0.15, -0.11, [['Malegaon', 'मालेगाव'], ['Shirpur Jain', 'शिरपूर जैन'], ['Medshi', 'मेडशी'], ['Wanoja', 'वानोजा']]],
      ['Mangrulpir', 'मंगरूळपीर', 0.21, 0.21, [['Mangrulpir', 'मंगरूळपीर'], ['Shelu Bazar', 'शेलू बाजार'], ['Asegaon', 'आसेगाव'], ['Dhanora', 'धानोरा']]],
      ['Karanja', 'कारंजा (लाड)', 0.37, 0.35, [['Karanja Lad', 'कारंजा लाड'], ['Kamargaon', 'कामरगाव'], ['Dhanaj', 'धनज'], ['Umbarda Bazar', 'उंबर्डा बाजार']]],
      ['Manora', 'मानोरा', 0.10, 0.44, [['Manora', 'मानोरा'], ['Pohradevi', 'पोहरादेवी'], ['Kupta', 'कुप्टा'], ['Inzori', 'इंझोरी']]],
    ]),
  },
  {
    id: 'amravati',
    nameEn: 'Amravati',
    nameMr: 'अमरावती',
    nameHi: 'अमरावती',
    division: 'Amravati',
    lat: 20.9374,
    lng: 77.7796,
    talukas: buildTalukas('amravati', 20.9374, 77.7796, [
      ['Amravati', 'अमरावती', 0, 0, [['Amravati', 'अमरावती'], ['Badnera', 'बडनेरा'], ['Nandgaon Peth', 'नांदगाव पेठ'], ['Walgaon', 'वळगाव'], ['Mahuli Jahagir', 'माहुली जहागीर']]],
      ['Bhatkuli', 'भातकुली', -0.04, -0.15, [['Bhatkuli', 'भातकुली'], ['Kholapur', 'खोलापूर'], ['Ashti', 'आष्टी'], ['Purnanagar', 'पूर्णानगर']]],
      ['Nandgaon Khandeshwar', 'नांदगाव खंडेश्वर', -0.29, -0.03, [['Nandgaon Khandeshwar', 'नांदगाव खंडेश्वर'], ['Loni', 'लोणी'], ['Papal', 'पापळ'], ['Mangrul Chawala', 'मंगरूळ चव्हाळा']]],
      ['Chandur Railway', 'चांदूर रेल्वे', -0.12, 0.17, [['Chandur Railway', 'चांदूर रेल्वे'], ['Rajura', 'राजुरा'], ['Palaskhed', 'पळसखेड'], ['Sawalapur', 'सावळापूर']]],
      ['Dhamangaon Railway', 'धामणगाव रेल्वे', -0.15, 0.35, [['Dhamangaon Railway', 'धामणगाव रेल्वे'], ['Talegaon Dashasar', 'तळेगाव दशासर'], ['Mangrul Dastagir', 'मंगरूळ दस्तगीर'], ['Deogaon', 'देवगाव']]],
      ['Tiwsa', 'तिवसा', 0.14, 0.25, [['Tiwsa', 'तिवसा'], ['Mozari', 'मोझरी'], ['Kurha', 'कुऱ्हा'], ['Shirajgaon', 'शिरजगाव']]],
      ['Morshi', 'मोर्शी', 0.39, 0.23, [['Morshi', 'मोर्शी'], ['Riddhapur', 'रिद्धपूर'], ['Ner Pinglai', 'नेर पिंगळाई'], ['Hiwarkhed', 'हिवरखेड']]],
      ['Warud', 'वरूड', 0.53, 0.49, [['Warud', 'वरूड'], ['Shendurjana Ghat', 'शेंदुरजना घाट'], ['Jarud', 'जरूड'], ['Benoda', 'बेनोडा'], ['Pusla', 'पुसला']]],
      ['Chandurbazar', 'चांदूरबाजार', 0.30, -0.04, [['Chandurbazar', 'चांदूरबाजार'], ['Shirasgaon Kasba', 'शिरसगाव कसबा'], ['Belora', 'बेलोरा'], ['Brahmanwada Thadi', 'ब्राह्मणवाडा थडी']]],
      ['Achalpur', 'अचलपूर', 0.32, -0.27, [['Achalpur', 'अचलपूर'], ['Paratwada', 'परतवाडा'], ['Deogaon', 'देवगाव'], ['Pathrot', 'पथ्रोट']]],
      ['Anjangaon Surji', 'अंजनगाव सुर्जी', 0.22, -0.47, [['Anjangaon Surji', 'अंजनगाव सुर्जी'], ['Kapustalni', 'कापुसतळणी'], ['Bhandaraj', 'भंडारज'], ['Sategaon', 'सातेगाव']]],
      ['Daryapur', 'दर्यापूर', -0.02, -0.45, [['Daryapur', 'दर्यापूर'], ['Yeoda', 'येवदा'], ['Khallar', 'खल्लार'], ['Babhali', 'बाभळी']]],
      ['Chikhaldara', 'चिखलदरा', 0.46, -0.45, [['Chikhaldara', 'चिखलदरा'], ['Semadoh', 'सेमाडोह'], ['Ghatang', 'घटांग'], ['Churni', 'चूर्णी']]],
      ['Dharni', 'धारणी', 0.64, -0.91, [['Dharni', 'धारणी'], ['Harisal', 'हरिसाल'], ['Kalamkhar', 'कळमखार'], ['Sadrabadi', 'सद्राबाडी']]],
    ]),
  },
  {
    id: 'yavatmal',
    nameEn: 'Yavatmal',
    nameMr: 'यवतमाळ',
    nameHi: 'यवतमाल',
    division: 'Amravati',
    lat: 20.3899,
    lng: 78.1307,
    talukas: buildTalukas('yavatmal', 20.3899, 78.1307, [
      ['Yavatmal', 'यवतमाळ', 0, 0, [['Yavatmal', 'यवतमाळ'], ['Lohara', 'लोहारा'], ['Wadgaon Road', 'वडगाव रोड'], ['Bhamb Raja', 'भांब राजा'], ['Akola Bazar', 'अकोला बाजार']]],
      ['Babhulgaon', 'बाभुळगाव', 0.17, -0.03, [['Babhulgaon', 'बाभुळगाव'], ['Pahur', 'पहूर'], ['Gharphal', 'घरफळ'], ['Sawargaon', 'सावरगाव']]],
      ['Kalamb', 'कळंब', 0.05, 0.19, [['Kalamb', 'कळंब'], ['Jodmoha', 'जोडमोहा'], ['Pimpalgaon', 'पिंपळगाव'], ['Dongarkharda', 'डोंगरखर्डा']]],
      ['Ralegaon', 'राळेगाव', 0.04, 0.39, [['Ralegaon', 'राळेगाव'], ['Wadki', 'वडकी'], ['Zadgaon', 'झाडगाव'], ['Pimpri Durg', 'पिंपरी दुर्ग']]],
      ['Ner', 'नेर', 0.06, -0.28, [['Ner', 'नेर'], ['Malkhed', 'मालखेड'], ['Dhanora', 'धानोरा'], ['Shirpur', 'शिरपूर']]],
      ['Darwha', 'दारव्हा', -0.08, -0.36, [['Darwha', 'दारव्हा'], ['Bori Arab', 'बोरी अरब'], ['Lohi', 'लोही'], ['Chikhli', 'चिखली']]],
      ['Digras', 'दिग्रस', -0.29, -0.36, [['Digras', 'दिग्रस'], ['Singad', 'सिंगड'], ['Kalgaon', 'काळगाव'], ['Mokh', 'मोख']]],
      ['Pusad', 'पुसद', -0.48, -0.56, [['Pusad', 'पुसद'], ['Khandala', 'खंडाळा'], ['Shilona', 'शिलोणा'], ['Gahuli', 'गहुली']]],
      ['Umarkhed', 'उमरखेड', -0.79, -0.44, [['Umarkhed', 'उमरखेड'], ['Dhanki', 'ढाणकी'], ['Bitargaon', 'बितरगाव'], ['Mulawa', 'मुळावा']]],
      ['Mahagaon', 'महागाव', -0.60, -0.34, [['Mahagaon', 'महागाव'], ['Fulsawangi', 'फुलसावंगी'], ['Gunj', 'गुंज'], ['Kali Daulatkhan', 'काळी दौलतखान']]],
      ['Arni', 'आर्णी', -0.32, -0.17, [['Arni', 'आर्णी'], ['Jawala', 'जवळा'], ['Khandala', 'खंडाळा'], ['Loni', 'लोणी']]],
      ['Ghatanji', 'घाटंजी', -0.25, 0.18, [['Ghatanji', 'घाटंजी'], ['Parwa', 'पारवा'], ['Kurli', 'कुर्ली'], ['Manoli', 'मानोली']]],
      ['Kelapur (Pandharkawada)', 'केळापूर (पांढरकवडा)', -0.36, 0.42, [['Pandharkawada', 'पांढरकवडा'], ['Kelapur', 'केळापूर'], ['Runza', 'रुंझा'], ['Patanbori', 'पाटणबोरी']]],
      ['Maregaon', 'मारेगाव', -0.39, 0.65, [['Maregaon', 'मारेगाव'], ['Mardi', 'मार्डी'], ['Kegaon', 'केगाव'], ['Wegaon', 'वेगाव']]],
      ['Zari Jamani', 'झरी जामणी', -0.57, 0.69, [['Zari Jamani', 'झरी जामणी'], ['Mukutban', 'मुकुटबन'], ['Patani', 'पाटणी'], ['Shibla', 'शिबला']]],
      ['Wani', 'वणी', -0.33, 0.82, [['Wani', 'वणी'], ['Ghonsa', 'घोन्सा'], ['Shirpur', 'शिरपूर'], ['Kayar', 'कायर'], ['Rajur', 'राजूर']]],
    ]),
  },

  // ==================== NAGPUR DIVISION ====================
  {
    id: 'wardha',
    nameEn: 'Wardha',
    nameMr: 'वर्धा',
    nameHi: 'वर्धा',
    division: 'Nagpur',
    lat: 20.7453,
    lng: 78.6022,
    talukas: buildTalukas('wardha', 20.7453, 78.6022, [
      ['Wardha', 'वर्धा', 0, 0, [['Wardha', 'वर्धा'], ['Sewagram', 'सेवाग्राम'], ['Paunar', 'पवनार'], ['Waigaon Nipani', 'वायगाव निपाणी'], ['Anji', 'आंजी']]],
      ['Deoli', 'देवळी', -0.09, -0.12, [['Deoli', 'देवळी'], ['Pulgaon', 'पुलगाव'], ['Nachangaon', 'नाचणगाव'], ['Bhidi', 'भिडी']]],
      ['Seloo', 'सेलू', 0.09, 0.10, [['Seloo', 'सेलू'], ['Sindi Railway', 'सिंदी रेल्वे'], ['Ghorad', 'घोराड'], ['Kelzar', 'केळझर']]],
      ['Arvi', 'आर्वी', 0.25, -0.37, [['Arvi', 'आर्वी'], ['Rohana', 'रोहणा'], ['Virul', 'विरूल'], ['Kharangana', 'खरांगणा']]],
      ['Ashti', 'आष्टी', 0.45, -0.43, [['Ashti', 'आष्टी'], ['Sahoor', 'सहूर'], ['Tarsoli', 'तारसोली'], ['Antora', 'अंतोरा']]],
      ['Karanja (Ghadge)', 'कारंजा (घाडगे)', 0.42, -0.18, [['Karanja Ghadge', 'कारंजा घाडगे'], ['Thanegaon', 'ठाणेगाव'], ['Nara', 'नारा'], ['Chincholi', 'चिंचोली']]],
      ['Hinganghat', 'हिंगणघाट', -0.20, 0.23, [['Hinganghat', 'हिंगणघाट'], ['Wadner', 'वडनेर'], ['Kangaon', 'कानगाव'], ['Allipur', 'अल्लीपूर']]],
      ['Samudrapur', 'समुद्रपूर', -0.23, 0.43, [['Samudrapur', 'समुद्रपूर'], ['Jamb', 'जांब'], ['Girad', 'गिरड'], ['Mandgaon', 'मांडगाव']]],
    ]),
  },
  {
    id: 'nagpur',
    nameEn: 'Nagpur',
    nameMr: 'नागपूर',
    nameHi: 'नागपुर',
    division: 'Nagpur',
    lat: 21.1458,
    lng: 79.0882,
    talukas: buildTalukas('nagpur', 21.1458, 79.0882, [
      ['Hingna', 'हिंगणा', -0.06, -0.12, [['Wanadongri', 'वाणाडोंगरी'], ['Hingna', 'हिंगणा'], ['Takalghat', 'टाकळघाट'], ['Gumgaon', 'गुमगाव'], ['Kanholibara', 'कान्होलीबारा'], ['Raipur', 'रायपूर']]],
      ['Nagpur Urban', 'नागपूर शहर', 0, 0, [['Nagpur', 'नागपूर'], ['Sitabuldi', 'सीताबर्डी'], ['Kamptee Road', 'कामठी रोड'], ['Dighori', 'दिघोरी']]],
      ['Nagpur Rural', 'नागपूर ग्रामीण', -0.08, 0.05, [['Wadi', 'वाडी'], ['Koradi', 'कोराडी'], ['Hudkeshwar', 'हुडकेश्वर'], ['Besa', 'बेसा'], ['Gorewada', 'गोरेवाडा']]],
      ['Kamptee', 'कामठी', 0.08, 0.11, [['Kamptee', 'कामठी'], ['Kanhan', 'कन्हान'], ['Yerkheda', 'येरखेडा'], ['Gumthala', 'गुमथळा']]],
      ['Katol', 'काटोल', 0.12, -0.50, [['Katol', 'काटोल'], ['Kondhali', 'कोंढाळी'], ['Ridhora', 'रिधोरा'], ['Metpanjra', 'मेटपांजरा']]],
      ['Narkhed', 'नरखेड', 0.32, -0.55, [['Narkhed', 'नरखेड'], ['Mowad', 'मोवाड'], ['Jalalkheda', 'जलालखेडा'], ['Sawargaon', 'सावरगाव']]],
      ['Savner', 'सावनेर', 0.24, -0.17, [['Savner', 'सावनेर'], ['Khapa', 'खापा'], ['Patansaongi', 'पाटणसावंगी'], ['Kelwad', 'केळवद']]],
      ['Kalmeshwar', 'कळमेश्वर', 0.09, -0.17, [['Kalmeshwar', 'कळमेश्वर'], ['Dhapewada', 'धापेवाडा'], ['Mohpa', 'मोहपा'], ['Gondkhairi', 'गोंडखैरी']]],
      ['Ramtek', 'रामटेक', 0.25, 0.23, [['Ramtek', 'रामटेक'], ['Deolapar', 'देवलापार'], ['Mansar', 'मनसर'], ['Nagardhan', 'नगरधन']]],
      ['Parseoni', 'पारशिवनी', 0.23, 0.06, [['Parseoni', 'पारशिवनी'], ['Nayakund', 'नायकुंड'], ['Aroli', 'आरोली'], ['Tekadi', 'टेकाडी']]],
      ['Mouda', 'मौदा', 0.02, 0.31, [['Mouda', 'मौदा'], ['Aroli', 'आरोली'], ['Kodamendhi', 'कोदामेंढी'], ['Nimkheda', 'निमखेडा']]],
      ['Umred', 'उमरेड', -0.29, 0.24, [['Umred', 'उमरेड'], ['Bela', 'बेला'], ['Makardhokda', 'मकरधोकडा'], ['Sirsi', 'सिरसी']]],
      ['Bhiwapur', 'भिवापूर', -0.38, 0.43, [['Bhiwapur', 'भिवापूर'], ['Nand', 'नांद'], ['Jawali', 'जावळी'], ['Chicholi', 'चिंचोली']]],
      ['Kuhi', 'कुही', -0.13, 0.28, [['Kuhi', 'कुही'], ['Mandhal', 'मांढळ'], ['Weltur', 'वेलतूर'], ['Pachkhedi', 'पाचखेडी']]],
    ]),
  },
  {
    id: 'bhandara',
    nameEn: 'Bhandara',
    nameMr: 'भंडारा',
    nameHi: 'भंडारा',
    division: 'Nagpur',
    lat: 21.1702,
    lng: 79.6489,
    talukas: buildTalukas('bhandara', 21.1702, 79.6489, [
      ['Bhandara', 'भंडारा', 0, 0, [['Bhandara', 'भंडारा'], ['Kardha', 'करधा'], ['Shahapur', 'शहापूर'], ['Koka', 'कोका'], ['Bela', 'बेला']]],
      ['Tumsar', 'तुमसर', 0.21, 0.10, [['Tumsar', 'तुमसर'], ['Sihora', 'सिहोरा'], ['Dewhadi', 'देव्हाडी'], ['Madgi', 'माडगी']]],
      ['Mohadi', 'मोहाडी', 0.14, 0.01, [['Mohadi', 'मोहाडी'], ['Andhalgaon', 'आंधळगाव'], ['Kandri', 'कांद्री'], ['Warthi', 'वरठी']]],
      ['Sakoli', 'साकोली', -0.09, 0.35, [['Sakoli', 'साकोली'], ['Sangadi', 'सांगडी'], ['Sendurwafa', 'सेंदुरवाफा'], ['Kumbhali', 'कुंभली']]],
      ['Lakhani', 'लाखनी', -0.10, 0.22, [['Lakhani', 'लाखनी'], ['Palandur', 'पालांदूर'], ['Morgaon', 'मोरगाव'], ['Pohara', 'पोहरा']]],
      ['Pauni', 'पवनी', -0.38, -0.02, [['Pauni', 'पवनी'], ['Adyal', 'अड्याळ'], ['Asgaon', 'आसगाव'], ['Chichal', 'चिचाल']]],
      ['Lakhandur', 'लाखांदूर', -0.35, 0.25, [['Lakhandur', 'लाखांदूर'], ['Dighori', 'दिघोरी'], ['Barwha', 'बारव्हा'], ['Sarandi', 'सरंडी']]],
    ]),
  },
  {
    id: 'gondia',
    nameEn: 'Gondia',
    nameMr: 'गोंदिया',
    nameHi: 'गोंदिया',
    division: 'Nagpur',
    lat: 21.4624,
    lng: 80.2210,
    talukas: buildTalukas('gondia', 21.4624, 80.2210, [
      ['Gondia', 'गोंदिया', 0, 0, [['Gondia', 'गोंदिया'], ['Fulchur', 'फुलचूर'], ['Kudwa', 'कुडवा'], ['Dasgaon', 'दासगाव'], ['Khamari', 'खमारी']]],
      ['Tirora', 'तिरोडा', -0.05, -0.29, [['Tirora', 'तिरोडा'], ['Murdada', 'मुरदाडा'], ['Kachewani', 'काचेवाणी'], ['Mendipur', 'मेंदीपूर']]],
      ['Goregaon', 'गोरेगाव', -0.16, -0.04, [['Goregaon', 'गोरेगाव'], ['Kurhadi', 'कुऱ्हाडी'], ['Mundipar', 'मुंडीपार'], ['Chopa', 'चोपा']]],
      ['Amgaon', 'आमगाव', -0.10, 0.16, [['Amgaon', 'आमगाव'], ['Padampur', 'पदमपूर'], ['Banathar', 'बनथर'], ['Kattipar', 'कट्टीपार']]],
      ['Salekasa', 'सालेकसा', -0.17, 0.26, [['Salekasa', 'सालेकसा'], ['Darekasa', 'दरेकसा'], ['Amgaon Kh', 'आमगाव खु.'], ['Bijepar', 'बिजेपार']]],
      ['Sadak Arjuni', 'सडक अर्जुनी', -0.36, -0.07, [['Sadak Arjuni', 'सडक अर्जुनी'], ['Duggipar', 'डुग्गीपार'], ['Saundad', 'सौंदड'], ['Bamhani', 'बाम्हणी']]],
      ['Deori', 'देवरी', -0.40, 0.15, [['Deori', 'देवरी'], ['Chichgarh', 'चिचगड'], ['Purada', 'पुराडा'], ['Mulla', 'मुल्ला']]],
      ['Arjuni Morgaon', 'अर्जुनी मोरगाव', -0.63, -0.15, [['Arjuni Morgaon', 'अर्जुनी मोरगाव'], ['Navegaon Bandh', 'नवेगावबांध'], ['Mahagaon', 'महागाव'], ['Itiadoh', 'इटियाडोह']]],
    ]),
  },
  {
    id: 'chandrapur',
    nameEn: 'Chandrapur',
    nameMr: 'चंद्रपूर',
    nameHi: 'चंद्रपुर',
    division: 'Nagpur',
    lat: 19.9615,
    lng: 79.2961,
    talukas: buildTalukas('chandrapur', 19.9615, 79.2961, [
      ['Chandrapur', 'चंद्रपूर', 0, 0, [['Chandrapur', 'चंद्रपूर'], ['Ghugus', 'घुग्घुस'], ['Durgapur', 'दुर्गापूर'], ['Padoli', 'पडोली'], ['Tadoba Road', 'ताडोबा रोड']]],
      ['Ballarpur', 'बल्लारपूर', -0.12, 0.06, [['Ballarpur', 'बल्लारपूर'], ['Bamni', 'बामणी'], ['Kothari', 'कोठारी'], ['Visapur', 'विसापूर']]],
      ['Bhadravati', 'भद्रावती', 0.15, -0.18, [['Bhadravati', 'भद्रावती'], ['Majri', 'माजरी'], ['Chora', 'चोरा'], ['Sumthana', 'सुमठाणा']]],
      ['Warora', 'वरोरा', 0.27, -0.29, [['Warora', 'वरोरा'], ['Anandwan', 'आनंदवन'], ['Shegaon Bk', 'शेगाव बु.'], ['Madheli', 'माढेळी']]],
      ['Chimur', 'चिमूर', 0.53, -0.01, [['Chimur', 'चिमूर'], ['Shankarpur', 'शंकरपूर'], ['Neri', 'नेरी'], ['Bhisi', 'भिसी']]],
      ['Nagbhid', 'नागभीड', 0.61, 0.36, [['Nagbhid', 'नागभीड'], ['Talodhi Balapur', 'तळोधी बाळापूर'], ['Nawargaon', 'नवरगाव'], ['Kanpa', 'कान्पा']]],
      ['Bramhapuri', 'ब्रह्मपुरी', 0.65, 0.56, [['Bramhapuri', 'ब्रह्मपुरी'], ['Gangalwadi', 'गांगलवाडी'], ['Chaugan', 'चौगण'], ['Mendaki', 'मेंडकी']]],
      ['Sindewahi', 'सिंदेवाही', 0.32, 0.37, [['Sindewahi', 'सिंदेवाही'], ['Nawargaon', 'नवरगाव'], ['Lonwahi', 'लोणवाही'], ['Gunjewahi', 'गुंजेवाही']]],
      ['Mul', 'मूल', 0.11, 0.38, [['Mul', 'मूल'], ['Chichpalli', 'चिचपल्ली'], ['Rajoli', 'राजोली'], ['Maroda', 'मारोडा']]],
      ['Saoli', 'सावली', 0.06, 0.51, [['Saoli', 'सावली'], ['Vyahad', 'व्याहाड'], ['Khedi', 'खेडी'], ['Pathari', 'पाथरी']]],
      ['Pombhurna', 'पोंभुर्णा', -0.05, 0.44, [['Pombhurna', 'पोंभुर्णा'], ['Jam Tukum', 'जाम तुकुम'], ['Chak Pombhurna', 'चक पोंभुर्णा']]],
      ['Gondpipri', 'गोंडपिपरी', -0.22, 0.39, [['Gondpipri', 'गोंडपिपरी'], ['Dhaba', 'धाबा'], ['Tohogaon', 'तोहोगाव'], ['Bhangaram Talodhi', 'भंगाराम तळोधी']]],
      ['Rajura', 'राजुरा', -0.18, 0.07, [['Rajura', 'राजुरा'], ['Sasti', 'सास्ती'], ['Subhashgram', 'सुभाषग्राम'], ['Wirur', 'विरूर']]],
      ['Korpana', 'कोरपना', -0.24, -0.17, [['Korpana', 'कोरपना'], ['Gadchandur', 'गडचांदूर'], ['Awarpur', 'आवारपूर'], ['Wansadi', 'वनसडी']]],
      ['Jiwati', 'जिवती', -0.37, -0.26, [['Jiwati', 'जिवती'], ['Patan', 'पाटण'], ['Shengaon', 'शेनगाव'], ['Tekamandwa', 'टेकमांडवा']]],
    ]),
  },
  {
    id: 'gadchiroli',
    nameEn: 'Gadchiroli',
    nameMr: 'गडचिरोली',
    nameHi: 'गडचिरोली',
    division: 'Nagpur',
    lat: 20.1849,
    lng: 80.0033,
    talukas: buildTalukas('gadchiroli', 20.1849, 80.0033, [
      ['Gadchiroli', 'गडचिरोली', 0, 0, [['Gadchiroli', 'गडचिरोली'], ['Porla', 'पोर्ला'], ['Amirza', 'अमिर्झा'], ['Kaneri', 'कनेरी'], ['Kotgal', 'कोटगल']]],
      ['Armori', 'आरमोरी', 0.28, -0.02, [['Armori', 'आरमोरी'], ['Vairagad', 'वैरागड'], ['Deulgaon', 'देऊळगाव'], ['Delanwadi', 'देलनवाडी']]],
      ['Desaiganj (Wadsa)', 'देसाईगंज (वडसा)', 0.43, -0.04, [['Wadsa (Desaiganj)', 'वडसा (देसाईगंज)'], ['Kurud', 'कुरुड'], ['Shankarpur', 'शंकरपूर'], ['Kondhala', 'कोंढाळा']]],
      ['Kurkheda', 'कुरखेडा', 0.43, 0.26, [['Kurkheda', 'कुरखेडा'], ['Malewada', 'मालेवाडा'], ['Gewardha', 'गेवर्धा'], ['Purada', 'पुराडा']]],
      ['Korchi', 'कोरची', 0.49, 0.45, [['Korchi', 'कोरची'], ['Kotgul', 'कोटगूल'], ['Botezari', 'बोटेझरी'], ['Belgaon', 'बेलगाव']]],
      ['Dhanora', 'धानोरा', 0.08, 0.29, [['Dhanora', 'धानोरा'], ['Pendhri', 'पेंढरी'], ['Chatgaon', 'चातगाव'], ['Murumgaon', 'मुरुमगाव']]],
      ['Chamorshi', 'चामोर्शी', -0.26, -0.09, [['Chamorshi', 'चामोर्शी'], ['Ashti', 'आष्टी'], ['Ghot', 'घोट'], ['Kunghada', 'कुंघाडा']]],
      ['Mulchera', 'मुलचेरा', -0.50, -0.06, [['Mulchera', 'मुलचेरा'], ['Sundarnagar', 'सुंदरनगर'], ['Kopalli', 'कोपल्ली'], ['Yella', 'येल्ला']]],
      ['Aheri', 'अहेरी', -0.77, 0.00, [['Aheri', 'अहेरी'], ['Allapalli', 'अल्लापल्ली'], ['Kamalapur', 'कमलापूर'], ['Mahagaon', 'महागाव']]],
      ['Etapalli', 'एटापल्ली', -0.56, 0.25, [['Etapalli', 'एटापल्ली'], ['Kasansoor', 'कसनसूर'], ['Gatta', 'गट्टा'], ['Todsa', 'तोडसा']]],
      ['Bhamragad', 'भामरागड', -0.76, 0.56, [['Bhamragad', 'भामरागड'], ['Hemalkasa', 'हेमलकसा'], ['Laheri', 'लाहेरी'], ['Kothi', 'कोठी']]],
      ['Sironcha', 'सिरोंचा', -1.34, -0.03, [['Sironcha', 'सिरोंचा'], ['Asaralli', 'असरअल्ली'], ['Ankisa', 'अंकिसा'], ['Bamni', 'बामणी']]],
    ]),
  },
];

export interface FlattenedLocationOption {
  type: 'district' | 'taluka' | 'village';
  districtEn: string;
  districtMr: string;
  talukaEn: string;
  talukaMr: string;
  villageEn: string;
  villageMr: string;
  lat: number;
  lng: number;
  searchBlob: string;
}

let cachedIndex: FlattenedLocationOption[] | null = null;

export function getAllLocationSearchIndex(): FlattenedLocationOption[] {
  if (cachedIndex) return cachedIndex;
  const list: FlattenedLocationOption[] = [];
  for (const dist of MAHARASHTRA_DISTRICTS) {
    list.push({
      type: 'district',
      districtEn: dist.nameEn,
      districtMr: dist.nameMr,
      talukaEn: dist.talukas[0]?.nameEn || dist.nameEn,
      talukaMr: dist.talukas[0]?.nameMr || dist.nameMr,
      villageEn: '',
      villageMr: '',
      lat: dist.lat,
      lng: dist.lng,
      searchBlob: `${dist.nameEn} ${dist.nameMr} ${dist.nameHi} ${dist.division}`.toLowerCase(),
    });
    for (const tal of dist.talukas) {
      list.push({
        type: 'taluka',
        districtEn: dist.nameEn,
        districtMr: dist.nameMr,
        talukaEn: tal.nameEn,
        talukaMr: tal.nameMr,
        villageEn: tal.villages[0]?.nameEn || tal.nameEn,
        villageMr: tal.villages[0]?.nameMr || tal.nameMr,
        lat: tal.lat,
        lng: tal.lng,
        searchBlob: `${tal.nameEn} ${tal.nameMr} ${dist.nameEn} ${dist.nameMr}`.toLowerCase(),
      });
      for (const vil of tal.villages) {
        list.push({
          type: 'village',
          districtEn: dist.nameEn,
          districtMr: dist.nameMr,
          talukaEn: tal.nameEn,
          talukaMr: tal.nameMr,
          villageEn: vil.nameEn,
          villageMr: vil.nameMr,
          lat: tal.lat,
          lng: tal.lng,
          searchBlob: `${vil.nameEn} ${vil.nameMr} ${tal.nameEn} ${tal.nameMr} ${dist.nameEn} ${dist.nameMr}`.toLowerCase(),
        });
      }
    }
  }
  cachedIndex = list;
  return list;
}

export function searchMaharashtraLocations(query: string, limit = 24): FlattenedLocationOption[] {
  const index = getAllLocationSearchIndex();
  const q = query.trim().toLowerCase();
  if (!q) {
    // Return all 36 district entries + prominent talukas when empty
    return index.filter((item) => item.type === 'district').slice(0, limit);
  }
  const exactStarts: FlattenedLocationOption[] = [];
  const contains: FlattenedLocationOption[] = [];
  for (const item of index) {
    const primary = (
      item.type === 'village'
        ? `${item.villageEn} ${item.villageMr}`
        : item.type === 'taluka'
          ? `${item.talukaEn} ${item.talukaMr}`
          : `${item.districtEn} ${item.districtMr}`
    ).toLowerCase();
    if (primary.startsWith(q)) {
      exactStarts.push(item);
    } else if (item.searchBlob.includes(q)) {
      contains.push(item);
    }
    if (exactStarts.length >= limit) break;
  }
  return [...exactStarts, ...contains].slice(0, limit);
}

export function findDistrictByName(name: string): MaharashtraDistrict | undefined {
  const n = name.trim().toLowerCase();
  if (!n || n === 'all') return undefined;
  return MAHARASHTRA_DISTRICTS.find(
    (d) =>
      d.nameEn.toLowerCase() === n ||
      d.nameMr.toLowerCase() === n ||
      d.nameEn.toLowerCase().includes(n) ||
      n.includes(d.nameEn.toLowerCase().split(' ')[0])
  );
}

export function findTalukaInDistrict(
  districtName: string,
  talukaName: string
): MaharashtraTaluka | undefined {
  const dist = findDistrictByName(districtName);
  if (!dist) return undefined;
  const t = talukaName.trim().toLowerCase();
  return dist.talukas.find(
    (tal) =>
      tal.nameEn.toLowerCase() === t ||
      tal.nameMr.toLowerCase() === t ||
      tal.nameEn.toLowerCase().includes(t)
  );
}

export function resolveCoordinatesForLocation(
  districtName?: string,
  talukaName?: string
): { lat: number; lng: number } {
  if (districtName && talukaName) {
    const tal = findTalukaInDistrict(districtName, talukaName);
    if (tal) return { lat: tal.lat, lng: tal.lng };
  }
  if (districtName) {
    const dist = findDistrictByName(districtName);
    if (dist) return { lat: dist.lat, lng: dist.lng };
  }
  return { lat: 18.1517, lng: 74.5768 };
}
