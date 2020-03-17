let nameComparison = {
  Canada: "加拿大",
  Russia: "俄羅斯",
  China: "中國",
  "United States": "美國",
  "Singapore Rep.": "新加坡",
  "Dominican Rep.": "多米尼加",
  Palestine: "巴勒斯坦",
  Bahamas: "巴哈馬",
  "Timor-Leste": "東帝汶",
  Afghanistan: "阿富汗",
  "Guinea-Bissau": "幾內亞比索",
  "Côted'Ivoire": "象牙海岸",
  "Siachen Glacier": "錫亞琴冰川",
  "Br. Indian Ocean Ter.": "英屬印度洋領土",
  Angola: "安哥拉",
  Albania: "阿爾巴尼亞",
  "United Arab Emirates": "阿聯酋",
  Argentina: "阿根廷",
  Armenia: "亞美尼亞",
  "French Southern and Antarctic Lands": "法屬南半球和南極領地",
  Australia: "澳大利亞",
  Austria: "奧地利",
  Azerbaijan: "亞塞拜然",
  Burundi: "蒲隆地",
  Belgium: "比利時",
  Benin: "貝南",
  "Burkina Faso": "布吉納法索",
  Bangladesh: "孟加拉國",
  Bulgaria: "保加利亞",
  "The Bahamas": "巴哈馬",
  "Bosnia and Herz.": "波士尼亞赫塞哥維納",
  Belarus: "白俄羅斯",
  Belize: "貝里斯",
  Bermuda: "百慕大",
  Bolivia: "玻利維亞",
  Brazil: "巴西",
  Brunei: "汶萊",
  Bhutan: "不丹",
  Botswana: "波札那",
  "Central African Rep.": "中非",
  Switzerland: "瑞士",
  Chile: "智利",
  "Ivory Coast": "象牙海岸",
  Cameroon: "喀麥隆",
  "Dem. Rep. Congo": "剛果民主共和國",
  Congo: "剛果",
  Colombia: "哥倫比亞",
  "Costa Rica": "哥斯大黎加",
  Cuba: "古巴",
  "N. Cyprus": "北塞普勒斯",
  Cyprus: "塞普勒斯",
  "Czech Rep.": "捷克",
  Germany: "德國",
  Djibouti: "吉布地",
  Denmark: "丹麥",
  Algeria: "阿爾及利亞",
  Ecuador: "厄瓜多",
  Egypt: "埃及",
  Eritrea: "厄利垂亞",
  Spain: "西班牙",
  Estonia: "愛沙尼亞",
  Ethiopia: "衣索比亞",
  Finland: "芬蘭",
  Fiji: "斐",
  "Falkland Islands": "福克蘭群島",
  France: "法國",
  Gabon: "加彭",
  "United Kingdom": "英國",
  Georgia: "喬治亞",
  Ghana: "迦納",
  Guinea: "幾內亞",
  Gambia: "甘比亞",
  "Guinea Bissau": "幾內亞比索",
  "Eq. Guinea": "赤道幾內亞",
  Greece: "希臘",
  Greenland: "格陵蘭",
  Guatemala: "瓜地馬拉",
  "French Guiana": "法屬蓋亞那",
  Guyana: "蓋亞那",
  Honduras: "宏都拉斯",
  Croatia: "克羅埃西亞",
  Haiti: "海地",
  Hungary: "匈牙利",
  Indonesia: "印度尼西亞",
  India: "印度",
  Ireland: "愛爾蘭",
  Iran: "伊朗",
  Iraq: "伊拉克",
  Iceland: "冰島",
  Israel: "以色列",
  Italy: "義大利",
  Jamaica: "牙買加",
  Jordan: "約旦",
  Japan: "日本",
  Kazakhstan: "哈薩克",
  Kenya: "肯亞",
  Kyrgyzstan: "吉爾吉斯斯坦",
  Cambodia: "柬埔寨",
  Korea: "韓國",
  Kosovo: "科索沃",
  Kuwait: "科威特",
  "Lao PDR": "寮國",
  Lebanon: "黎巴嫩",
  Liberia: "賴比瑞亞",
  Libya: "利比亞",
  "Sri Lanka": "斯里蘭卡",
  Lesotho: "賴索托",
  Lithuania: "立陶宛",
  Luxembourg: "盧森堡",
  Latvia: "拉脫維亞",
  Morocco: "摩洛哥",
  Moldova: "摩爾多瓦",
  Madagascar: "馬達加斯加",
  Mexico: "墨西哥",
  Macedonia: "馬其頓",
  Mali: "馬里",
  Myanmar: "緬甸",
  Montenegro: "黑山",
  Mongolia: "蒙古",
  Mozambique: "莫三比克",
  Mauritania: "茅利塔尼亞",
  Malawi: "馬拉維",
  Malaysia: "馬來西亞",
  Namibia: "納米比亞",
  "New Caledonia": "新喀里多尼亞",
  Niger: "尼日",
  Nigeria: "奈及利亞",
  Nicaragua: "尼加拉瓜",
  Netherlands: "荷蘭",
  Norway: "挪威",
  Nepal: "尼泊爾",
  "New Zealand": "紐西蘭",
  Oman: "阿曼",
  Pakistan: "巴基斯坦",
  Panama: "巴拿馬",
  Peru: "秘魯",
  Philippines: "菲律賓",
  "Papua New Guinea": "巴布亞紐幾內亞",
  Poland: "波蘭",
  "Puerto Rico": "波多黎各",
  "Dem. Rep. Korea": "朝鮮",
  Portugal: "葡萄牙",
  Paraguay: "巴拉圭",
  Qatar: "卡達",
  Romania: "羅馬尼亞",
  Rwanda: "盧安達",
  "W. Sahara": "西撒哈拉",
  "Saudi Arabia": "沙烏地阿拉伯",
  Sudan: "蘇丹",
  "S. Sudan": "南蘇丹",
  Senegal: "塞內加爾",
  "Solomon Is.": "索羅門群島",
  "Sierra Leone": "獅子山",
  "El Salvador": "薩爾瓦多",
  Somaliland: "索馬利亞蘭",
  Somalia: "索馬利亞",
  Serbia: "塞爾維亞",
  Suriname: "蘇利南",
  Slovakia: "斯洛伐克",
  Slovenia: "斯洛維尼亞",
  Sweden: "瑞典",
  Swaziland: "史瓦濟蘭",
  Syria: "敘利亞",
  Chad: "查德",
  Togo: "多哥",
  Thailand: "泰國",
  Tajikistan: "塔吉克",
  Turkmenistan: "土庫曼",
  "East Timor": "東帝汶",
  "Trinidad and Tobago": "特里尼達和多巴哥",
  Tunisia: "突尼西亞",
  Turkey: "土耳其",
  Tanzania: "坦尚尼亞",
  Uganda: "烏干達",
  Ukraine: "烏克蘭",
  Uruguay: "烏拉圭",
  Uzbekistan: "烏茲別克",
  Venezuela: "委內瑞拉",
  Vietnam: "越南",
  Vanuatu: "萬那杜",
  "West Bank": "西岸",
  Yemen: "葉門",
  "South Africa": "南非",
  Zambia: "尚比亞",
  Zimbabwe: "辛巴威"
};

export default nameComparison;
