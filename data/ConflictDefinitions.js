/**
 * Conflict Definitions
 * 
 * This file contains definitions of major global conflicts,
 * mapping countries to specific conflicts and providing context.
 */

export const ConflictDefinitions = [
    {
      id: "ukraine-russia",
      name: "Russia-Ukraine War",
      countries: ["Ukraine", "Russia"],
      description: "Full-scale Russian invasion of Ukraine that began on February 24, 2022. The conflict escalated from Russia's 2014 annexation of Crimea and the war in Donbas. It represents the largest conventional military attack in Europe since World War II.",
      primaryActors: ["Russian Armed Forces", "Ukrainian Armed Forces", "Wagner Group", "International volunteers"],
      startDate: "2022-02-24",
      location: {
        lat: 49.0139,
        lng: 31.2858
      },
      type: "interstate",
      background: "Tensions escalated following the 2014 Ukrainian Revolution, Russia's annexation of Crimea, and the establishment of Russian-backed separatist states in eastern Ukraine. The conflict became a full-scale invasion in 2022."
    },
    
    {
      id: "israel-palestine",
      name: "Israel-Palestine Conflict",
      countries: ["Israel", "Palestine", "Lebanon"],
      description: "Long-standing conflict centered on territorial claims and national self-determination. Recently escalated following the October 7, 2023 Hamas attack and subsequent Israeli military response in Gaza, with additional fronts opening in Lebanon.",
      primaryActors: ["Israel Defense Forces", "Hamas", "Hezbollah", "Palestinian Islamic Jihad"],
      startDate: "1948-05-14",
      location: {
        lat: 31.5,
        lng: 34.8
      },
      type: "territorial",
      background: "Historical dispute over land claims in the former British Mandate of Palestine. Characterized by periods of peace negotiations and violent escalations. Recent conflict includes intense fighting in Gaza and cross-border exchanges with Lebanon."
    },
    
    {
      id: "syria-civil-war",
      name: "Syrian Civil War",
      countries: ["Syria"],
      description: "Multi-sided civil war in Syria that grew out of the 2011 Arab Spring protests. The conflict involves the Syrian government, opposition groups, jihadist organizations, and multiple international actors.",
      primaryActors: ["Syrian Armed Forces", "Syrian Opposition", "Islamic State", "Kurdish Forces", "Foreign militaries"],
      startDate: "2011-03-15",
      location: {
        lat: 35.0,
        lng: 38.0
      },
      type: "civil war",
      background: "Began as protests against President Bashar al-Assad's government and evolved into a complex proxy war with international involvement from Russia, Iran, Turkey, the United States, and others."
    },
    
    {
      id: "myanmar-civil-war",
      name: "Myanmar Civil War",
      countries: ["Myanmar"],
      description: "Intensified civil conflict following the 2021 military coup that overthrew the democratically elected government. Multiple ethnic armed organizations and pro-democracy forces fight against the military junta.",
      primaryActors: ["Myanmar Military (Tatmadaw)", "People's Defense Forces", "Ethnic Armed Organizations"],
      startDate: "2021-02-01",
      location: {
        lat: 21.9162,
        lng: 95.9560
      },
      type: "civil war",
      background: "Myanmar has experienced on-and-off civil conflict since independence in 1948, but violence dramatically increased after the 2021 military coup overthrew Aung San Suu Kyi's government."
    },
    
    {
      id: "sahel-insurgency",
      name: "Sahel Insurgency",
      countries: ["Mali", "Niger", "Burkina Faso", "Chad"],
      description: "Ongoing jihadist insurgency across the Sahel region of Africa, characterized by armed attacks, ethnic violence, and competition for resources intensified by climate change.",
      primaryActors: ["Jama'at Nasr al-Islam wal Muslimin (JNIM)", "Islamic State in the Greater Sahara", "National Armed Forces", "Wagner Group/Russian mercenaries"],
      startDate: "2012-01-16",
      location: {
        lat: 14.5,
        lng: 0.0
      },
      type: "insurgency",
      background: "The conflict began following the collapse of Libya and a Tuareg rebellion in Mali, which created space for jihadist groups to establish themselves. Multiple coups have since occurred in the region, and traditional alliances with Western forces have been replaced by Russian influence."
    },
    
    {
      id: "sudan-conflict",
      name: "Sudanese Armed Conflict",
      countries: ["Sudan", "South Sudan"],
      description: "Armed conflict between the Sudanese Armed Forces (SAF) and the paramilitary Rapid Support Forces (RSF) that erupted in April 2023, resulting in a severe humanitarian crisis.",
      primaryActors: ["Sudanese Armed Forces", "Rapid Support Forces", "Regional militias"],
      startDate: "2023-04-15",
      location: {
        lat: 12.8628,
        lng: 30.2176
      },
      type: "civil war",
      background: "The conflict emerged from tensions during Sudan's transition to democracy following the 2019 overthrow of longtime leader Omar al-Bashir. Power struggles between military factions led to open warfare in Khartoum and across the country."
    },
    
    {
      id: "yemen-civil-war",
      name: "Yemen Civil War",
      countries: ["Yemen"],
      description: "Multi-faceted civil war with regional implications that has created one of the world's worst humanitarian crises, with widespread famine and disease.",
      primaryActors: ["Houthi Movement", "Yemeni Government", "Southern Transitional Council", "Saudi-led Coalition", "UAE-backed forces"],
      startDate: "2014-09-21",
      location: {
        lat: 15.5527,
        lng: 48.5164
      },
      type: "civil war",
      background: "Began when Houthi rebels seized control of much of the northwest, including the capital Sanaa. Saudi Arabia and allies intervened in 2015 to reinstate the internationally recognized government. Recent Houthi attacks on shipping in the Red Sea have added an international dimension."
    },
    
    {
      id: "drc-conflict",
      name: "DRC Eastern Conflict",
      countries: ["Democratic Republic of Congo"],
      description: "Complex and long-running conflict in eastern DRC involving dozens of armed groups fighting for control of land and valuable mineral resources.",
      primaryActors: ["Armed Forces of the DRC", "M23 Movement", "FDLR", "Various local militias"],
      startDate: "1996-10-24",
      location: {
        lat: -1.6734,
        lng: 29.2399
      },
      type: "civil war",
      background: "The eastern DRC has seen continuous conflict since the aftermath of the Rwandan genocide. Despite peace agreements, fighting continues between government forces, local armed groups, and rebels allegedly supported by neighboring countries."
    },
    
    {
      id: "ethiopia-tigray",
      name: "Ethiopian Conflicts",
      countries: ["Ethiopia"],
      description: "Civil conflict that began with fighting in the Tigray region between federal forces and the Tigray People's Liberation Front, later expanding to other regions including Amhara and Oromia.",
      primaryActors: ["Ethiopian National Defense Force", "Tigray Defense Forces", "Oromo Liberation Army", "Amhara militias"],
      startDate: "2020-11-04",
      location: {
        lat: 9.1450,
        lng: 40.4897
      },
      type: "civil war",
      background: "Political tensions between Prime Minister Abiy Ahmed's government and the formerly dominant Tigray People's Liberation Front erupted into open conflict in November 2020. Though a peace agreement was signed in 2022, fighting continues in other regions."
    },
    
    {
      id: "somalia-insurgency",
      name: "Somali Insurgency",
      countries: ["Somalia"],
      description: "Ongoing insurgency by the Islamist group Al-Shabaab against the Federal Government of Somalia and African Union forces.",
      primaryActors: ["Federal Government of Somalia", "Al-Shabaab", "African Union forces", "US military"],
      startDate: "2006-12-24",
      location: {
        lat: 5.1521,
        lng: 46.1996
      },
      type: "insurgency",
      background: "Al-Shabaab has waged an insurgency against Somalia's internationally backed government since 2006, seeking to impose a strict interpretation of Islamic law and remove foreign forces from the country."
    },
    
    {
      id: "mexico-cartel-violence",
      name: "Mexican Drug War",
      countries: ["Mexico"],
      description: "Ongoing asymmetric conflict between the Mexican government and various drug trafficking syndicates, characterized by extreme violence and territorial disputes between rival cartels.",
      primaryActors: ["Mexican government forces", "Sinaloa Cartel", "Jalisco New Generation Cartel", "Gulf Cartel", "Other criminal organizations"],
      startDate: "2006-12-11",
      location: {
        lat: 23.6345,
        lng: -102.5528
      },
      type: "criminal violence",
      background: "Intensified when President Felipe Calderón deployed federal troops to combat drug cartels in 2006. The militarized approach has led to fragmentation of cartels, turf wars, and extreme violence affecting civilian populations."
    },
    
    {
      id: "afghanistan-taliban",
      name: "Afghanistan Conflict",
      countries: ["Afghanistan", "Pakistan"],
      description: "Ongoing insurgency against Taliban rule by ISIS-K and resistance forces, following the Taliban takeover in 2021 after two decades of war.",
      primaryActors: ["Taliban government", "Islamic State Khorasan Province", "National Resistance Front", "Pakistan Taliban (TTP)"],
      startDate: "2021-08-15",
      location: {
        lat: 33.9391,
        lng: 67.7100
      },
      type: "insurgency",
      background: "Following the US withdrawal and Taliban takeover in 2021, Afghanistan continues to experience violence from ISIS-K attacks against Taliban rule and civilians, economic collapse, and humanitarian crisis."
    },
    
    {
      id: "cameroon-ambazonia",
      name: "Cameroonian Conflicts",
      countries: ["Cameroon"],
      description: "Dual conflicts including an Anglophone separatist insurgency in western regions and Boko Haram attacks in the north.",
      primaryActors: ["Government of Cameroon", "Ambazonia separatists", "Boko Haram"],
      startDate: "2017-09-22",
      location: {
        lat: 7.3697,
        lng: 12.3547
      },
      type: "insurgency",
      background: "The Anglophone conflict began in 2016 with protests against marginalization of English-speaking regions, escalating to armed conflict after a government crackdown. Simultaneously, Cameroon faces Boko Haram attacks in its Far North region."
    },
    
    {
      id: "mozambique-insurgency",
      name: "Mozambique Insurgency",
      countries: ["Mozambique"],
      description: "Islamist insurgency in Cabo Delgado province by militants locally known as al-Shabaab with links to the Islamic State.",
      primaryActors: ["Mozambique Armed Forces", "Islamist insurgents", "Southern African Development Community forces", "Rwandan forces"],
      startDate: "2017-10-05",
      location: {
        lat: -12.3333,
        lng: 39.3333
      },
      type: "insurgency",
      background: "The insurgency began in 2017 in Cabo Delgado, a region rich in natural gas but marked by poverty and grievances. International forces have helped the government reclaim some areas, but violence continues."
    },
    
    {
      id: "haiti-gang-violence",
      name: "Haitian Gang Crisis",
      countries: ["Haiti"],
      description: "Widespread gang violence and political instability following the 2021 assassination of President Jovenel Moïse, with gangs controlling large parts of the capital.",
      primaryActors: ["G9 gang alliance", "400 Mawozo", "Government of Haiti", "Multinational Security Support Mission"],
      startDate: "2021-07-07",
      location: {
        lat: 18.9712,
        lng: -72.2852
      },
      type: "criminal violence",
      background: "Haiti has faced growing gang violence amidst political and economic crises. After President Moïse's assassination, gangs expanded control over Port-au-Prince, leading to widespread displacement, kidnappings, and humanitarian emergency."
    },
    
    {
      id: "nigeria-conflicts",
      name: "Nigerian Conflicts",
      countries: ["Nigeria"],
      description: "Multiple security crises including Boko Haram insurgency in the northeast, banditry in the northwest, and farmer-herder conflicts in the Middle Belt.",
      primaryActors: ["Nigerian Armed Forces", "Boko Haram", "Islamic State West Africa Province (ISWAP)", "Bandits", "Farmer/herder militias"],
      startDate: "2009-07-26",
      location: {
        lat: 9.0820,
        lng: 8.6753
      },
      type: "insurgency",
      background: "Nigeria faces overlapping security challenges: the Boko Haram insurgency that began in 2009, banditry and kidnapping for ransom in the northwest, and farmer-herder conflicts exacerbated by climate change and competition for resources."
    },
    
    {
      id: "colombia-armed-conflict",
      name: "Colombian Armed Conflict",
      countries: ["Colombia", "Venezuela"],
      description: "Ongoing conflict involving government forces, ELN rebels, FARC dissidents, and criminal groups despite the 2016 peace agreement with the main FARC group.",
      primaryActors: ["Colombian Armed Forces", "ELN (National Liberation Army)", "FARC dissidents", "Gulf Clan"],
      startDate: "1964-05-27",
      location: {
        lat: 4.5709,
        lng: -74.2973
      },
      type: "insurgency",
      background: "Colombia's decades-long civil conflict continues despite the 2016 peace deal with FARC. The ELN, FARC dissident groups, and criminal organizations remain active, with violence concentrated in border regions and areas with illegal economies."
    },
    
    {
      id: "brazil-criminal-violence",
      name: "Brazilian Gang Violence",
      countries: ["Brazil"],
      description: "Large-scale criminal violence driven by powerful prison-based gangs and militias competing for control of drug trafficking routes and territories.",
      primaryActors: ["Primeiro Comando da Capital (PCC)", "Comando Vermelho", "Militias", "Brazilian security forces"],
      startDate: "2006-05-12",
      location: {
        lat: -14.2350,
        lng: -51.9253
      },
      type: "criminal violence",
      background: "Brazil faces endemic violence from organized crime groups that evolved from prison gangs into sophisticated criminal enterprises controlling territories in urban areas and international drug trafficking routes."
    },
    
    {
      id: "india-maoist",
      name: "India's Naxalite-Maoist Insurgency",
      countries: ["India"],
      description: "Communist insurgency in eastern and central Indian states where Maoist rebels, known as Naxalites, fight government forces in rural and tribal areas.",
      primaryActors: ["Indian security forces", "Communist Party of India (Maoist)"],
      startDate: "1967-05-25",
      location: {
        lat: 20.5937,
        lng: 80.9629
      },
      type: "insurgency",
      background: "India's longest-running internal conflict stems from a 1967 peasant uprising and has continued as a Maoist insurgency fighting for greater rights for rural poor and tribal communities in resource-rich but underdeveloped regions."
    },
    
    {
      id: "pakistan-militancy",
      name: "Pakistan's Militant Conflicts",
      countries: ["Pakistan"],
      description: "Multiple insurgencies including the Pakistani Taliban resurgence in the northwest, Baloch separatism in the southwest, and sectarian violence throughout the country.",
      primaryActors: ["Pakistani security forces", "Tehrik-i-Taliban Pakistan (TTP)", "Balochistan Liberation Army", "Islamic State Khorasan"],
      startDate: "2007-07-10",
      location: {
        lat: 30.3753,
        lng: 69.3451
      },
      type: "insurgency",
      background: "Pakistan faces a resurgent Taliban insurgency along the Afghan border, separatist violence in Balochistan province, and sectarian attacks by various militant groups, creating complex security challenges."
    },

  ];