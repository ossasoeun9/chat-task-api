const countryList = [
  {
    name: "Afghanistan",
    code: "AF",
    dial_code: "+93",
    id: "63bbc94bf0b83972547bade8",
  },
  {
    name: "Aland Islands",
    code: "AX",
    dial_code: "+358",
    id: "63bbc94bf0b83972547bade9",
  },
  {
    name: "Albania",
    code: "AL",
    dial_code: "+355",
    id: "63bbc94bf0b83972547badea",
  },
  {
    name: "Algeria",
    code: "DZ",
    dial_code: "+213",
    id: "63bbc94bf0b83972547badeb",
  },
  {
    name: "AmericanSamoa",
    code: "AS",
    dial_code: "+1684",
    id: "63bbc94bf0b83972547badec",
  },
  {
    name: "Andorra",
    code: "AD",
    dial_code: "+376",
    id: "63bbc94bf0b83972547baded",
  },
  {
    name: "Angola",
    code: "AO",
    dial_code: "+244",
    id: "63bbc94bf0b83972547badee",
  },
  {
    name: "Anguilla",
    code: "AI",
    dial_code: "+1264",
    id: "63bbc94bf0b83972547badef",
  },
  {
    name: "Antarctica",
    code: "AQ",
    dial_code: "+672",
    id: "63bbc94bf0b83972547badf0",
  },
  {
    name: "Antigua and Barbuda",
    code: "AG",
    dial_code: "+1268",
    id: "63bbc94bf0b83972547badf1",
  },
  {
    name: "Argentina",
    code: "AR",
    dial_code: "+54",
    id: "63bbc94bf0b83972547badf2",
  },
  {
    name: "Armenia",
    code: "AM",
    dial_code: "+374",
    id: "63bbc94bf0b83972547badf3",
  },
  {
    name: "Aruba",
    code: "AW",
    dial_code: "+297",
    id: "63bbc94bf0b83972547badf4",
  },
  {
    name: "Australia",
    code: "AU",
    dial_code: "+61",
    id: "63bbc94bf0b83972547badf5",
  },
  {
    name: "Austria",
    code: "AT",
    dial_code: "+43",
    id: "63bbc94bf0b83972547badf6",
  },
  {
    name: "Azerbaijan",
    code: "AZ",
    dial_code: "+994",
    id: "63bbc94bf0b83972547badf7",
  },
  {
    name: "Bahamas",
    code: "BS",
    dial_code: "+1242",
    id: "63bbc94bf0b83972547badf8",
  },
  {
    name: "Bahrain",
    code: "BH",
    dial_code: "+973",
    id: "63bbc94bf0b83972547badf9",
  },
  {
    name: "Bangladesh",
    code: "BD",
    dial_code: "+880",
    id: "63bbc94bf0b83972547badfa",
  },
  {
    name: "Barbados",
    code: "BB",
    dial_code: "+1246",
    id: "63bbc94bf0b83972547badfb",
  },
  {
    name: "Belarus",
    code: "BY",
    dial_code: "+375",
    id: "63bbc94bf0b83972547badfc",
  },
  {
    name: "Belgium",
    code: "BE",
    dial_code: "+32",
    id: "63bbc94bf0b83972547badfd",
  },
  {
    name: "Belize",
    code: "BZ",
    dial_code: "+501",
    id: "63bbc94bf0b83972547badfe",
  },
  {
    name: "Benin",
    code: "BJ",
    dial_code: "+229",
    id: "63bbc94bf0b83972547badff",
  },
  {
    name: "Bermuda",
    code: "BM",
    dial_code: "+1441",
    id: "63bbc94bf0b83972547bae00",
  },
  {
    name: "Bhutan",
    code: "BT",
    dial_code: "+975",
    id: "63bbc94bf0b83972547bae01",
  },
  {
    name: "Bolivia, Plurinational State of",
    code: "BO",
    dial_code: "+591",
    id: "63bbc94bf0b83972547bae02",
  },
  {
    name: "Bosnia and Herzegovina",
    code: "BA",
    dial_code: "+387",
    id: "63bbc94bf0b83972547bae03",
  },
  {
    name: "Botswana",
    code: "BW",
    dial_code: "+267",
    id: "63bbc94bf0b83972547bae04",
  },
  {
    name: "Brazil",
    code: "BR",
    dial_code: "+55",
    id: "63bbc94bf0b83972547bae05",
  },
  {
    name: "British Indian Ocean Territory",
    code: "IO",
    dial_code: "+246",
    id: "63bbc94bf0b83972547bae06",
  },
  {
    name: "Brunei Darussalam",
    code: "BN",
    dial_code: "+673",
    id: "63bbc94bf0b83972547bae07",
  },
  {
    name: "Bulgaria",
    code: "BG",
    dial_code: "+359",
    id: "63bbc94bf0b83972547bae08",
  },
  {
    name: "Burkina Faso",
    code: "BF",
    dial_code: "+226",
    id: "63bbc94bf0b83972547bae09",
  },
  {
    name: "Burundi",
    code: "BI",
    dial_code: "+257",
    id: "63bbc94bf0b83972547bae0a",
  },
  {
    name: "Cambodia",
    code: "KH",
    dial_code: "+855",
    id: "63bbc94bf0b83972547bae0b",
  },
  {
    name: "Cameroon",
    code: "CM",
    dial_code: "+237",
    id: "63bbc94bf0b83972547bae0c",
  },
  {
    name: "Canada",
    code: "CA",
    dial_code: "+1",
    id: "63bbc94bf0b83972547bae0d",
  },
  {
    name: "Cape Verde",
    code: "CV",
    dial_code: "+238",
    id: "63bbc94bf0b83972547bae0e",
  },
  {
    name: "Cayman Islands",
    code: "KY",
    dial_code: "+345",
    id: "63bbc94bf0b83972547bae0f",
  },
  {
    name: "Central African Republic",
    code: "CF",
    dial_code: "+236",
    id: "63bbc94bf0b83972547bae10",
  },
  {
    name: "Chad",
    code: "TD",
    dial_code: "+235",
    id: "63bbc94bf0b83972547bae11",
  },
  {
    name: "Chile",
    code: "CL",
    dial_code: "+56",
    id: "63bbc94bf0b83972547bae12",
  },
  {
    name: "China",
    code: "CN",
    dial_code: "+86",
    id: "63bbc94bf0b83972547bae13",
  },
  {
    name: "Christmas Island",
    code: "CX",
    dial_code: "+61",
    id: "63bbc94bf0b83972547bae14",
  },
  {
    name: "Cocos (Keeling) Islands",
    code: "CC",
    dial_code: "+61",
    id: "63bbc94bf0b83972547bae15",
  },
  {
    name: "Colombia",
    code: "CO",
    dial_code: "+57",
    id: "63bbc94bf0b83972547bae16",
  },
  {
    name: "Comoros",
    code: "KM",
    dial_code: "+269",
    id: "63bbc94bf0b83972547bae17",
  },
  {
    name: "Congo",
    code: "CG",
    dial_code: "+242",
    id: "63bbc94bf0b83972547bae18",
  },
  {
    name: "Congo, The Democratic Republic of the Congo",
    code: "CD",
    dial_code: "+243",
    id: "63bbc94bf0b83972547bae19",
  },
  {
    name: "Cook Islands",
    code: "CK",
    dial_code: "+682",
    id: "63bbc94bf0b83972547bae1a",
  },
  {
    name: "Costa Rica",
    code: "CR",
    dial_code: "+506",
    id: "63bbc94bf0b83972547bae1b",
  },
  {
    name: "Cote d'Ivoire",
    code: "CI",
    dial_code: "+225",
    id: "63bbc94bf0b83972547bae1c",
  },
  {
    name: "Croatia",
    code: "HR",
    dial_code: "+385",
    id: "63bbc94bf0b83972547bae1d",
  },
  {
    name: "Cuba",
    code: "CU",
    dial_code: "+53",
    id: "63bbc94bf0b83972547bae1e",
  },
  {
    name: "Cyprus",
    code: "CY",
    dial_code: "+357",
    id: "63bbc94bf0b83972547bae1f",
  },
  {
    name: "Czech Republic",
    code: "CZ",
    dial_code: "+420",
    id: "63bbc94bf0b83972547bae20",
  },
  {
    name: "Denmark",
    code: "DK",
    dial_code: "+45",
    id: "63bbc94bf0b83972547bae21",
  },
  {
    name: "Djibouti",
    code: "DJ",
    dial_code: "+253",
    id: "63bbc94bf0b83972547bae22",
  },
  {
    name: "Dominica",
    code: "DM",
    dial_code: "+1767",
    id: "63bbc94bf0b83972547bae23",
  },
  {
    name: "Dominican Republic",
    code: "DO",
    dial_code: "+1849",
    id: "63bbc94bf0b83972547bae24",
  },
  {
    name: "Ecuador",
    code: "EC",
    dial_code: "+593",
    id: "63bbc94bf0b83972547bae25",
  },
  {
    name: "Egypt",
    code: "EG",
    dial_code: "+20",
    id: "63bbc94bf0b83972547bae26",
  },
  {
    name: "El Salvador",
    code: "SV",
    dial_code: "+503",
    id: "63bbc94bf0b83972547bae27",
  },
  {
    name: "Equatorial Guinea",
    code: "GQ",
    dial_code: "+240",
    id: "63bbc94bf0b83972547bae28",
  },
  {
    name: "Eritrea",
    code: "ER",
    dial_code: "+291",
    id: "63bbc94bf0b83972547bae29",
  },
  {
    name: "Estonia",
    code: "EE",
    dial_code: "+372",
    id: "63bbc94bf0b83972547bae2a",
  },
  {
    name: "Ethiopia",
    code: "ET",
    dial_code: "+251",
    id: "63bbc94bf0b83972547bae2b",
  },
  {
    name: "Falkland Islands (Malvinas)",
    code: "FK",
    dial_code: "+500",
    id: "63bbc94bf0b83972547bae2c",
  },
  {
    name: "Faroe Islands",
    code: "FO",
    dial_code: "+298",
    id: "63bbc94bf0b83972547bae2d",
  },
  {
    name: "Fiji",
    code: "FJ",
    dial_code: "+679",
    id: "63bbc94bf0b83972547bae2e",
  },
  {
    name: "Finland",
    code: "FI",
    dial_code: "+358",
    id: "63bbc94bf0b83972547bae2f",
  },
  {
    name: "France",
    code: "FR",
    dial_code: "+33",
    id: "63bbc94bf0b83972547bae30",
  },
  {
    name: "French Guiana",
    code: "GF",
    dial_code: "+594",
    id: "63bbc94bf0b83972547bae31",
  },
  {
    name: "French Polynesia",
    code: "PF",
    dial_code: "+689",
    id: "63bbc94bf0b83972547bae32",
  },
  {
    name: "Gabon",
    code: "GA",
    dial_code: "+241",
    id: "63bbc94bf0b83972547bae33",
  },
  {
    name: "Gambia",
    code: "GM",
    dial_code: "+220",
    id: "63bbc94bf0b83972547bae34",
  },
  {
    name: "Georgia",
    code: "GE",
    dial_code: "+995",
    id: "63bbc94bf0b83972547bae35",
  },
  {
    name: "Germany",
    code: "DE",
    dial_code: "+49",
    id: "63bbc94bf0b83972547bae36",
  },
  {
    name: "Ghana",
    code: "GH",
    dial_code: "+233",
    id: "63bbc94bf0b83972547bae37",
  },
  {
    name: "Gibraltar",
    code: "GI",
    dial_code: "+350",
    id: "63bbc94bf0b83972547bae38",
  },
  {
    name: "Greece",
    code: "GR",
    dial_code: "+30",
    id: "63bbc94bf0b83972547bae39",
  },
  {
    name: "Greenland",
    code: "GL",
    dial_code: "+299",
    id: "63bbc94bf0b83972547bae3a",
  },
  {
    name: "Grenada",
    code: "GD",
    dial_code: "+1473",
    id: "63bbc94bf0b83972547bae3b",
  },
  {
    name: "Guadeloupe",
    code: "GP",
    dial_code: "+590",
    id: "63bbc94bf0b83972547bae3c",
  },
  {
    name: "Guam",
    code: "GU",
    dial_code: "+1671",
    id: "63bbc94bf0b83972547bae3d",
  },
  {
    name: "Guatemala",
    code: "GT",
    dial_code: "+502",
    id: "63bbc94bf0b83972547bae3e",
  },
  {
    name: "Guernsey",
    code: "GG",
    dial_code: "+44",
    id: "63bbc94bf0b83972547bae3f",
  },
  {
    name: "Guinea",
    code: "GN",
    dial_code: "+224",
    id: "63bbc94bf0b83972547bae40",
  },
  {
    name: "Guinea-Bissau",
    code: "GW",
    dial_code: "+245",
    id: "63bbc94bf0b83972547bae41",
  },
  {
    name: "Guyana",
    code: "GY",
    dial_code: "+595",
    id: "63bbc94bf0b83972547bae42",
  },
  {
    name: "Haiti",
    code: "HT",
    dial_code: "+509",
    id: "63bbc94bf0b83972547bae43",
  },
  {
    name: "Holy See (Vatican City State)",
    code: "VA",
    dial_code: "+379",
    id: "63bbc94bf0b83972547bae44",
  },
  {
    name: "Honduras",
    code: "HN",
    dial_code: "+504",
    id: "63bbc94bf0b83972547bae45",
  },
  {
    name: "Hong Kong",
    code: "HK",
    dial_code: "+852",
    id: "63bbc94bf0b83972547bae46",
  },
  {
    name: "Hungary",
    code: "HU",
    dial_code: "+36",
    id: "63bbc94bf0b83972547bae47",
  },
  {
    name: "Iceland",
    code: "IS",
    dial_code: "+354",
    id: "63bbc94bf0b83972547bae48",
  },
  {
    name: "India",
    code: "IN",
    dial_code: "+91",
    id: "63bbc94bf0b83972547bae49",
  },
  {
    name: "Indonesia",
    code: "ID",
    dial_code: "+62",
    id: "63bbc94bf0b83972547bae4a",
  },
  {
    name: "Iran, Islamic Republic of Persian Gulf",
    code: "IR",
    dial_code: "+98",
    id: "63bbc94bf0b83972547bae4b",
  },
  {
    name: "Iraq",
    code: "IQ",
    dial_code: "+964",
    id: "63bbc94bf0b83972547bae4c",
  },
  {
    name: "Ireland",
    code: "IE",
    dial_code: "+353",
    id: "63bbc94bf0b83972547bae4d",
  },
  {
    name: "Isle of Man",
    code: "IM",
    dial_code: "+44",
    id: "63bbc94bf0b83972547bae4e",
  },
  {
    name: "Israel",
    code: "IL",
    dial_code: "+972",
    id: "63bbc94bf0b83972547bae4f",
  },
  {
    name: "Italy",
    code: "IT",
    dial_code: "+39",
    id: "63bbc94bf0b83972547bae50",
  },
  {
    name: "Jamaica",
    code: "JM",
    dial_code: "+1876",
    id: "63bbc94bf0b83972547bae51",
  },
  {
    name: "Japan",
    code: "JP",
    dial_code: "+81",
    id: "63bbc94bf0b83972547bae52",
  },
  {
    name: "Jersey",
    code: "JE",
    dial_code: "+44",
    id: "63bbc94bf0b83972547bae53",
  },
  {
    name: "Jordan",
    code: "JO",
    dial_code: "+962",
    id: "63bbc94bf0b83972547bae54",
  },
  {
    name: "Kazakhstan",
    code: "KZ",
    dial_code: "+77",
    id: "63bbc94bf0b83972547bae55",
  },
  {
    name: "Kenya",
    code: "KE",
    dial_code: "+254",
    id: "63bbc94bf0b83972547bae56",
  },
  {
    name: "Kiribati",
    code: "KI",
    dial_code: "+686",
    id: "63bbc94bf0b83972547bae57",
  },
  {
    name: "Korea, Democratic People's Republic of Korea",
    code: "KP",
    dial_code: "+850",
    id: "63bbc94bf0b83972547bae58",
  },
  {
    name: "Korea, Republic of South Korea",
    code: "KR",
    dial_code: "+82",
    id: "63bbc94bf0b83972547bae59",
  },
  {
    name: "Kuwait",
    code: "KW",
    dial_code: "+965",
    id: "63bbc94bf0b83972547bae5a",
  },
  {
    name: "Kyrgyzstan",
    code: "KG",
    dial_code: "+996",
    id: "63bbc94bf0b83972547bae5b",
  },
  {
    name: "Laos",
    code: "LA",
    dial_code: "+856",
    id: "63bbc94bf0b83972547bae5c",
  },
  {
    name: "Latvia",
    code: "LV",
    dial_code: "+371",
    id: "63bbc94bf0b83972547bae5d",
  },
  {
    name: "Lebanon",
    code: "LB",
    dial_code: "+961",
    id: "63bbc94bf0b83972547bae5e",
  },
  {
    name: "Lesotho",
    code: "LS",
    dial_code: "+266",
    id: "63bbc94bf0b83972547bae5f",
  },
  {
    name: "Liberia",
    code: "LR",
    dial_code: "+231",
    id: "63bbc94bf0b83972547bae60",
  },
  {
    name: "Libyan Arab Jamahiriya",
    code: "LY",
    dial_code: "+218",
    id: "63bbc94bf0b83972547bae61",
  },
  {
    name: "Liechtenstein",
    code: "LI",
    dial_code: "+423",
    id: "63bbc94bf0b83972547bae62",
  },
  {
    name: "Lithuania",
    code: "LT",
    dial_code: "+370",
    id: "63bbc94bf0b83972547bae63",
  },
  {
    name: "Luxembourg",
    code: "LU",
    dial_code: "+352",
    id: "63bbc94bf0b83972547bae64",
  },
  {
    name: "Macao",
    code: "MO",
    dial_code: "+853",
    id: "63bbc94bf0b83972547bae65",
  },
  {
    name: "Macedonia",
    code: "MK",
    dial_code: "+389",
    id: "63bbc94bf0b83972547bae66",
  },
  {
    name: "Madagascar",
    code: "MG",
    dial_code: "+261",
    id: "63bbc94bf0b83972547bae67",
  },
  {
    name: "Malawi",
    code: "MW",
    dial_code: "+265",
    id: "63bbc94bf0b83972547bae68",
  },
  {
    name: "Malaysia",
    code: "MY",
    dial_code: "+60",
    id: "63bbc94bf0b83972547bae69",
  },
  {
    name: "Maldives",
    code: "MV",
    dial_code: "+960",
    id: "63bbc94bf0b83972547bae6a",
  },
  {
    name: "Mali",
    code: "ML",
    dial_code: "+223",
    id: "63bbc94bf0b83972547bae6b",
  },
  {
    name: "Malta",
    code: "MT",
    dial_code: "+356",
    id: "63bbc94bf0b83972547bae6c",
  },
  {
    name: "Marshall Islands",
    code: "MH",
    dial_code: "+692",
    id: "63bbc94bf0b83972547bae6d",
  },
  {
    name: "Martinique",
    code: "MQ",
    dial_code: "+596",
    id: "63bbc94bf0b83972547bae6e",
  },
  {
    name: "Mauritania",
    code: "MR",
    dial_code: "+222",
    id: "63bbc94bf0b83972547bae6f",
  },
  {
    name: "Mauritius",
    code: "MU",
    dial_code: "+230",
    id: "63bbc94bf0b83972547bae70",
  },
  {
    name: "Mayotte",
    code: "YT",
    dial_code: "+262",
    id: "63bbc94bf0b83972547bae71",
  },
  {
    name: "Mexico",
    code: "MX",
    dial_code: "+52",
    id: "63bbc94bf0b83972547bae72",
  },
  {
    name: "Micronesia, Federated States of Micronesia",
    code: "FM",
    dial_code: "+691",
    id: "63bbc94bf0b83972547bae73",
  },
  {
    name: "Moldova",
    code: "MD",
    dial_code: "+373",
    id: "63bbc94bf0b83972547bae74",
  },
  {
    name: "Monaco",
    code: "MC",
    dial_code: "+377",
    id: "63bbc94bf0b83972547bae75",
  },
  {
    name: "Mongolia",
    code: "MN",
    dial_code: "+976",
    id: "63bbc94bf0b83972547bae76",
  },
  {
    name: "Montenegro",
    code: "ME",
    dial_code: "+382",
    id: "63bbc94bf0b83972547bae77",
  },
  {
    name: "Montserrat",
    code: "MS",
    dial_code: "+1664",
    id: "63bbc94bf0b83972547bae78",
  },
  {
    name: "Morocco",
    code: "MA",
    dial_code: "+212",
    id: "63bbc94bf0b83972547bae79",
  },
  {
    name: "Mozambique",
    code: "MZ",
    dial_code: "+258",
    id: "63bbc94bf0b83972547bae7a",
  },
  {
    name: "Myanmar",
    code: "MM",
    dial_code: "+95",
    id: "63bbc94bf0b83972547bae7b",
  },
  {
    name: "Namibia",
    code: "NA",
    dial_code: "+264",
    id: "63bbc94bf0b83972547bae7c",
  },
  {
    name: "Nauru",
    code: "NR",
    dial_code: "+674",
    id: "63bbc94bf0b83972547bae7d",
  },
  {
    name: "Nepal",
    code: "NP",
    dial_code: "+977",
    id: "63bbc94bf0b83972547bae7e",
  },
  {
    name: "Netherlands",
    code: "NL",
    dial_code: "+31",
    id: "63bbc94bf0b83972547bae7f",
  },
  {
    name: "Netherlands Antilles",
    code: "AN",
    dial_code: "+599",
    id: "63bbc94bf0b83972547bae80",
  },
  {
    name: "New Caledonia",
    code: "NC",
    dial_code: "+687",
    id: "63bbc94bf0b83972547bae81",
  },
  {
    name: "New Zealand",
    code: "NZ",
    dial_code: "+64",
    id: "63bbc94bf0b83972547bae82",
  },
  {
    name: "Nicaragua",
    code: "NI",
    dial_code: "+505",
    id: "63bbc94bf0b83972547bae83",
  },
  {
    name: "Niger",
    code: "NE",
    dial_code: "+227",
    id: "63bbc94bf0b83972547bae84",
  },
  {
    name: "Nigeria",
    code: "NG",
    dial_code: "+234",
    id: "63bbc94bf0b83972547bae85",
  },
  {
    name: "Niue",
    code: "NU",
    dial_code: "+683",
    id: "63bbc94bf0b83972547bae86",
  },
  {
    name: "Norfolk Island",
    code: "NF",
    dial_code: "+672",
    id: "63bbc94bf0b83972547bae87",
  },
  {
    name: "Northern Mariana Islands",
    code: "MP",
    dial_code: "+1670",
    id: "63bbc94bf0b83972547bae88",
  },
  {
    name: "Norway",
    code: "NO",
    dial_code: "+47",
    id: "63bbc94bf0b83972547bae89",
  },
  {
    name: "Oman",
    code: "OM",
    dial_code: "+968",
    id: "63bbc94bf0b83972547bae8a",
  },
  {
    name: "Pakistan",
    code: "PK",
    dial_code: "+92",
    id: "63bbc94bf0b83972547bae8b",
  },
  {
    name: "Palau",
    code: "PW",
    dial_code: "+680",
    id: "63bbc94bf0b83972547bae8c",
  },
  {
    name: "Palestinian Territory, Occupied",
    code: "PS",
    dial_code: "+970",
    id: "63bbc94bf0b83972547bae8d",
  },
  {
    name: "Panama",
    code: "PA",
    dial_code: "+507",
    id: "63bbc94bf0b83972547bae8e",
  },
  {
    name: "Papua New Guinea",
    code: "PG",
    dial_code: "+675",
    id: "63bbc94bf0b83972547bae8f",
  },
  {
    name: "Paraguay",
    code: "PY",
    dial_code: "+595",
    id: "63bbc94bf0b83972547bae90",
  },
  {
    name: "Peru",
    code: "PE",
    dial_code: "+51",
    id: "63bbc94bf0b83972547bae91",
  },
  {
    name: "Philippines",
    code: "PH",
    dial_code: "+63",
    id: "63bbc94bf0b83972547bae92",
  },
  {
    name: "Pitcairn",
    code: "PN",
    dial_code: "+872",
    id: "63bbc94bf0b83972547bae93",
  },
  {
    name: "Poland",
    code: "PL",
    dial_code: "+48",
    id: "63bbc94bf0b83972547bae94",
  },
  {
    name: "Portugal",
    code: "PT",
    dial_code: "+351",
    id: "63bbc94bf0b83972547bae95",
  },
  {
    name: "Puerto Rico",
    code: "PR",
    dial_code: "+1939",
    id: "63bbc94bf0b83972547bae96",
  },
  {
    name: "Qatar",
    code: "QA",
    dial_code: "+974",
    id: "63bbc94bf0b83972547bae97",
  },
  {
    name: "Romania",
    code: "RO",
    dial_code: "+40",
    id: "63bbc94bf0b83972547bae98",
  },
  {
    name: "Russia",
    code: "RU",
    dial_code: "+7",
    id: "63bbc94bf0b83972547bae99",
  },
  {
    name: "Rwanda",
    code: "RW",
    dial_code: "+250",
    id: "63bbc94bf0b83972547bae9a",
  },
  {
    name: "Reunion",
    code: "RE",
    dial_code: "+262",
    id: "63bbc94bf0b83972547bae9b",
  },
  {
    name: "Saint Barthelemy",
    code: "BL",
    dial_code: "+590",
    id: "63bbc94bf0b83972547bae9c",
  },
  {
    name: "Saint Helena, Ascension and Tristan Da Cunha",
    code: "SH",
    dial_code: "+290",
    id: "63bbc94bf0b83972547bae9d",
  },
  {
    name: "Saint Kitts and Nevis",
    code: "KN",
    dial_code: "+1869",
    id: "63bbc94bf0b83972547bae9e",
  },
  {
    name: "Saint Lucia",
    code: "LC",
    dial_code: "+1758",
    id: "63bbc94bf0b83972547bae9f",
  },
  {
    name: "Saint Martin",
    code: "MF",
    dial_code: "+590",
    id: "63bbc94bf0b83972547baea0",
  },
  {
    name: "Saint Pierre and Miquelon",
    code: "PM",
    dial_code: "+508",
    id: "63bbc94bf0b83972547baea1",
  },
  {
    name: "Saint Vincent and the Grenadines",
    code: "VC",
    dial_code: "+1784",
    id: "63bbc94bf0b83972547baea2",
  },
  {
    name: "Samoa",
    code: "WS",
    dial_code: "+685",
    id: "63bbc94bf0b83972547baea3",
  },
  {
    name: "San Marino",
    code: "SM",
    dial_code: "+378",
    id: "63bbc94bf0b83972547baea4",
  },
  {
    name: "Sao Tome and Principe",
    code: "ST",
    dial_code: "+239",
    id: "63bbc94bf0b83972547baea5",
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    dial_code: "+966",
    id: "63bbc94bf0b83972547baea6",
  },
  {
    name: "Senegal",
    code: "SN",
    dial_code: "+221",
    id: "63bbc94bf0b83972547baea7",
  },
  {
    name: "Serbia",
    code: "RS",
    dial_code: "+381",
    id: "63bbc94bf0b83972547baea8",
  },
  {
    name: "Seychelles",
    code: "SC",
    dial_code: "+248",
    id: "63bbc94bf0b83972547baea9",
  },
  {
    name: "Sierra Leone",
    code: "SL",
    dial_code: "+232",
    id: "63bbc94bf0b83972547baeaa",
  },
  {
    name: "Singapore",
    code: "SG",
    dial_code: "+65",
    id: "63bbc94bf0b83972547baeab",
  },
  {
    name: "Slovakia",
    code: "SK",
    dial_code: "+421",
    id: "63bbc94bf0b83972547baeac",
  },
  {
    name: "Slovenia",
    code: "SI",
    dial_code: "+386",
    id: "63bbc94bf0b83972547baead",
  },
  {
    name: "Solomon Islands",
    code: "SB",
    dial_code: "+677",
    id: "63bbc94bf0b83972547baeae",
  },
  {
    name: "Somalia",
    code: "SO",
    dial_code: "+252",
    id: "63bbc94bf0b83972547baeaf",
  },
  {
    name: "South Africa",
    code: "ZA",
    dial_code: "+27",
    id: "63bbc94bf0b83972547baeb0",
  },
  {
    name: "South Sudan",
    code: "SS",
    dial_code: "+211",
    id: "63bbc94bf0b83972547baeb1",
  },
  {
    name: "South Georgia and the South Sandwich Islands",
    code: "GS",
    dial_code: "+500",
    id: "63bbc94bf0b83972547baeb2",
  },
  {
    name: "Spain",
    code: "ES",
    dial_code: "+34",
    id: "63bbc94bf0b83972547baeb3",
  },
  {
    name: "Sri Lanka",
    code: "LK",
    dial_code: "+94",
    id: "63bbc94bf0b83972547baeb4",
  },
  {
    name: "Sudan",
    code: "SD",
    dial_code: "+249",
    id: "63bbc94bf0b83972547baeb5",
  },
  {
    name: "Suriname",
    code: "SR",
    dial_code: "+597",
    id: "63bbc94bf0b83972547baeb6",
  },
  {
    name: "Svalbard and Jan Mayen",
    code: "SJ",
    dial_code: "+47",
    id: "63bbc94bf0b83972547baeb7",
  },
  {
    name: "Swaziland",
    code: "SZ",
    dial_code: "+268",
    id: "63bbc94bf0b83972547baeb8",
  },
  {
    name: "Sweden",
    code: "SE",
    dial_code: "+46",
    id: "63bbc94bf0b83972547baeb9",
  },
  {
    name: "Switzerland",
    code: "CH",
    dial_code: "+41",
    id: "63bbc94bf0b83972547baeba",
  },
  {
    name: "Syrian Arab Republic",
    code: "SY",
    dial_code: "+963",
    id: "63bbc94bf0b83972547baebb",
  },
  {
    name: "Taiwan",
    code: "TW",
    dial_code: "+886",
    id: "63bbc94bf0b83972547baebc",
  },
  {
    name: "Tajikistan",
    code: "TJ",
    dial_code: "+992",
    id: "63bbc94bf0b83972547baebd",
  },
  {
    name: "Tanzania, United Republic of Tanzania",
    code: "TZ",
    dial_code: "+255",
    id: "63bbc94bf0b83972547baebe",
  },
  {
    name: "Thailand",
    code: "TH",
    dial_code: "+66",
    id: "63bbc94bf0b83972547baebf",
  },
  {
    name: "Timor-Leste",
    code: "TL",
    dial_code: "+670",
    id: "63bbc94bf0b83972547baec0",
  },
  {
    name: "Togo",
    code: "TG",
    dial_code: "+228",
    id: "63bbc94bf0b83972547baec1",
  },
  {
    name: "Tokelau",
    code: "TK",
    dial_code: "+690",
    id: "63bbc94bf0b83972547baec2",
  },
  {
    name: "Tonga",
    code: "TO",
    dial_code: "+676",
    id: "63bbc94bf0b83972547baec3",
  },
  {
    name: "Trinidad and Tobago",
    code: "TT",
    dial_code: "+1868",
    id: "63bbc94bf0b83972547baec4",
  },
  {
    name: "Tunisia",
    code: "TN",
    dial_code: "+216",
    id: "63bbc94bf0b83972547baec5",
  },
  {
    name: "Turkey",
    code: "TR",
    dial_code: "+90",
    id: "63bbc94bf0b83972547baec6",
  },
  {
    name: "Turkmenistan",
    code: "TM",
    dial_code: "+993",
    id: "63bbc94bf0b83972547baec7",
  },
  {
    name: "Turks and Caicos Islands",
    code: "TC",
    dial_code: "+1649",
    id: "63bbc94bf0b83972547baec8",
  },
  {
    name: "Tuvalu",
    code: "TV",
    dial_code: "+688",
    id: "63bbc94bf0b83972547baec9",
  },
  {
    name: "Uganda",
    code: "UG",
    dial_code: "+256",
    id: "63bbc94bf0b83972547baeca",
  },
  {
    name: "Ukraine",
    code: "UA",
    dial_code: "+380",
    id: "63bbc94bf0b83972547baecb",
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    dial_code: "+971",
    id: "63bbc94bf0b83972547baecc",
  },
  {
    name: "United Kingdom",
    code: "GB",
    dial_code: "+44",
    id: "63bbc94bf0b83972547baecd",
  },
  {
    name: "United States",
    code: "US",
    dial_code: "+1",
    id: "63bbc94bf0b83972547baece",
  },
  {
    name: "Uruguay",
    code: "UY",
    dial_code: "+598",
    id: "63bbc94bf0b83972547baecf",
  },
  {
    name: "Uzbekistan",
    code: "UZ",
    dial_code: "+998",
    id: "63bbc94bf0b83972547baed0",
  },
  {
    name: "Vanuatu",
    code: "VU",
    dial_code: "+678",
    id: "63bbc94bf0b83972547baed1",
  },
  {
    name: "Venezuela, Bolivarian Republic of Venezuela",
    code: "VE",
    dial_code: "+58",
    id: "63bbc94bf0b83972547baed2",
  },
  {
    name: "Vietnam",
    code: "VN",
    dial_code: "+84",
    id: "63bbc94bf0b83972547baed3",
  },
  {
    name: "Virgin Islands, British",
    code: "VG",
    dial_code: "+1284",
    id: "63bbc94bf0b83972547baed4",
  },
  {
    name: "Virgin Islands, U.S.",
    code: "VI",
    dial_code: "+1340",
    id: "63bbc94bf0b83972547baed5",
  },
  {
    name: "Wallis and Futuna",
    code: "WF",
    dial_code: "+681",
    id: "63bbc94bf0b83972547baed6",
  },
  {
    name: "Yemen",
    code: "YE",
    dial_code: "+967",
    id: "63bbc94bf0b83972547baed7",
  },
  {
    name: "Zambia",
    code: "ZM",
    dial_code: "+260",
    id: "63bbc94bf0b83972547baed8",
  },
  {
    name: "Zimbabwe",
    code: "ZW",
    dial_code: "+263",
    id: "63bbc94bf0b83972547baed9",
  },
];

export default countryList;
