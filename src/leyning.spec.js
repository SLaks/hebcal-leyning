import test from 'ava';
import {hebcal} from '@hebcal/core';
import leyning from './leyning';

test('getLeyningKeyForEvent', (t) => {
//    const options = { year: 1997, noHolidays: true, sedrot: true, il: false };
  const options = {year: 5757, isHebrewYear: true};
  const events = hebcal.hebrewCalendar(options);
  for (const e of events) {
    const str = leyning.getLeyningKeyForEvent(e);
    //        console.log(e.getDate().greg().toLocaleDateString(), str, e.getDesc(), e.getDate().toString());
    switch (e.getDesc()) {
      case 'Chanukah: 2 Candles':
        t.is(str, 'Chanukah (Day 1)');
        break;
      case 'Chanukah: 8th Day':
        t.is(str, 'Chanukah (Day 8)');
        break;
      case 'Rosh Hashana 5757':
        t.is(str, 'Rosh Hashana I (on Shabbat)');
        break;
      case 'Sukkot III (CH\'\'M)':
        t.is(str, 'Sukkot Chol ha-Moed Day 1');
        break;
      case 'Sukkot VII (Hoshana Raba)':
        t.is(str, 'Sukkot Final Day (Hoshana Raba)');
        break;
      case 'Pesach III (CH\'\'M)':
        t.is(str, 'Pesach Chol ha-Moed Day 1');
        break;
      case 'Pesach IV (CH\'\'M)':
        t.is(str, 'Pesach Chol ha-Moed Day 2');
        break;
      case 'Pesach V (CH\'\'M)':
        t.is(str, 'Pesach Shabbat Chol ha-Moed');
        break;
      case 'Pesach VI (CH\'\'M)':
        t.is(str, 'Pesach Chol ha-Moed Day 3');
        break;
      default:
    }
  }
});


/*
7/18/1981 16th of Tamuz, 5741
7/18/1981 Parashat Pinchas
--
7/10/1982 19th of Tamuz, 5742
7/10/1982 Parashat Pinchas
*/
test('pinchas17Tamuz', (t) => {
  const options = {year: 1981, month: 7, isHebrewYear: false, sedrot: true, noHolidays: true};
  let events = hebcal.hebrewCalendar(options);
  let ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
  let a = leyning.getLeyningForParshaHaShavua(ev);
  t.is(a.reason, undefined);
  t.is(a.haftara, 'I Kings 18:46 - 19:21');

  options.year = 1982;
  events = hebcal.hebrewCalendar(options);
  ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
  a = leyning.getLeyningForParshaHaShavua(ev);
  t.is(a.haftara, 'Jeremiah 1:1 - 2:3');
  t.is(a.reason.haftara, 'Pinchas occurring after 17 Tammuz');
});

// eslint-disable-next-line require-jsdoc
function formatAliyah(aliyot, num) {
  return leyning.formatAliyahWithBook(aliyot.fullkriyah[num]);
}

test('getLeyningForParshaHaShavua', (t) => {
  const options = {year: 2026, isHebrewYear: false, sedrot: true, noHolidays: true};
  const events = hebcal.hebrewCalendar(options);
  for (const ev of events) {
    const a = leyning.getLeyningForParshaHaShavua(ev);
    switch (ev.getDesc()) {
      case 'Parashat Mishpatim':
        t.is(a.reason.haftara, 'Shabbat Shekalim');
        t.is(a.reason.M, 'Shabbat Shekalim');
        t.is(a.haftara, 'II Kings 12:1 - 12:17');
        t.is(formatAliyah(a, 'M'), 'Exodus 30:11 - 30:16');
        break;
      case 'Parashat Tetzaveh':
        t.is(a.reason.haftara, 'Shabbat Zachor');
        t.is(a.reason.M, 'Shabbat Zachor');
        t.is(a.haftara, 'I Samuel 15:2 - 15:34');
        t.is(formatAliyah(a, 'M'), 'Deuteronomy 25:17 - 25:19');
        break;
      case 'Parashat Ki Tisa':
        t.is(a.reason.haftara, 'Shabbat Parah');
        t.is(a.reason.M, 'Shabbat Parah');
        t.is(a.haftara, 'Ezekiel 36:16 - 36:38');
        t.is(formatAliyah(a, 'M'), 'Numbers 19:1 - 19:22');
        break;
      case 'Parashat Tzav':
        t.is(a.reason.haftara, 'Shabbat HaGadol');
        t.is(a.haftara, 'Malachi 3:4 - 3:24');
        break;
      case 'Parashat Tazria-Metzora':
        t.is(a.reason.haftara, 'Shabbat Rosh Chodesh');
        t.is(a.reason.M, 'Shabbat Rosh Chodesh');
        t.is(a.haftara, 'Isaiah 66:1 - 66:24');
        t.is(formatAliyah(a, 'M'), 'Numbers 28:9 - 28:15');
        break;
      case 'Parashat Bamidbar':
        t.is(a.reason.haftara, 'Shabbat Machar Chodesh');
        t.is(a.haftara, 'I Samuel 20:18 - 20:42');
        break;
      case 'Parashat Vayeshev':
        t.is(a.reason.haftara, 'Shabbat Chanukah');
        t.is(a.reason.M, 'Chanukah (Day 1)');
        t.is(a.haftara, 'Zechariah 2:14-4:7');
        t.is(formatAliyah(a, 'M'), 'Numbers 7:1 - 7:17');
        break;
      case 'Parashat Miketz':
        t.is(a.reason.haftara, 'Shabbat Chanukah II');
        t.is(a.reason.M, 'Chanukah (Day 8)');
        t.is(a.haftara, 'I Kings 7:40-50');
        t.is(formatAliyah(a, 'M'), 'Numbers 7:54 - 8:4');
        break;
    }
  }

  options.year = 2020;
  options.month = 12;
  const vayeshev = hebcal.hebrewCalendar(options).find((e) => e.getDesc() == 'Parashat Vayeshev');
  let a = leyning.getLeyningForParshaHaShavua(vayeshev);
  t.is(a.reason.haftara, 'Shabbat Chanukah');
  t.is(a.reason['M'], 'Chanukah (Day 2)');
  t.is(a.haftara, 'Zechariah 2:14-4:7');
  t.is(formatAliyah(a, 'M'), 'Numbers 7:18 - 7:29');

  options.year = 2021;
  options.month = 12;
  const miketz = hebcal.hebrewCalendar(options).find((e) => e.getDesc() == 'Parashat Miketz');
  a = leyning.getLeyningForParshaHaShavua(miketz);
  t.is(a.reason.haftara, 'Shabbat Rosh Chodesh Chanukah');
  t.is(a.reason['M'], 'Shabbat Rosh Chodesh Chanukah');
  t.is(a.reason['8'], 'Shabbat Rosh Chodesh Chanukah');
  t.is(a.haftara, 'Zechariah 2:14-4:7');
  t.is(formatAliyah(a, '8'), 'Numbers 28:9 - 28:15');
  t.is(formatAliyah(a, 'M'), 'Numbers 7:42 - 7:47');

  options.year = 2019;
  options.month = 4;
  const tazria = hebcal.hebrewCalendar(options).find((e) => e.getDesc() == 'Parashat Tazria');
  a = leyning.getLeyningForParshaHaShavua(tazria);
  t.is(a.reason.haftara, 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.reason['7'], 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.reason['M'], 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.haftara, 'Ezekiel 45:16 - 46:18');
  t.is(formatAliyah(a, '7'), 'Numbers 28:9 - 28:15');
  t.is(formatAliyah(a, 'M'), 'Exodus 12:1 - 12:20');
});

test('getLeyningForHoliday', (t) => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = hebcal.hebrewCalendar(options);

  const sukkot1 = events.find((e) => e.getDesc() == 'Sukkot I');
  t.is(leyning.getLeyningForHoliday(sukkot1).fullkriyah['7'].p, 31);
  const sukkot2 = events.find((e) => e.getDesc() == 'Sukkot II (CH\'\'M)');
  t.is(leyning.getLeyningForHoliday(sukkot2).fullkriyah['4'].p, 41);
  const shminiAtzeret = events.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(leyning.getLeyningForHoliday(shminiAtzeret).fullkriyah['7'].p, 47);
  const chanukah3 = events.find((e) => e.getDesc() == 'Chanukah: 3 Candles');
  t.is(leyning.getLeyningForHoliday(chanukah3).fullkriyah['3'].e, '7:29');
  const tevet17 = events.find((e) => e.getDesc() == 'Asara B\'Tevet');
  t.is(leyning.getLeyningForHoliday(tevet17).fullkriyah['3'].e, '34:10');
  const pesach5 = events.find((e) => e.getDesc() == 'Pesach V (CH\'\'M)');
  t.is(leyning.getLeyningForHoliday(pesach5).fullkriyah['4'].p, 21);
  const shavuot = events.find((e) => e.getDesc() == 'Shavuot');
  t.is(leyning.getLeyningForHoliday(shavuot).fullkriyah['4'].p, 17);
  const av9 = events.find((e) => e.getDesc() == 'Tish\'a B\'Av');
  t.is(leyning.getLeyningForHoliday(av9).haftara, 'Jeremiah 8:13 - 9:23');
});

test('shmini-atzeret', (t) => {
  const diaspora = hebcal.hebrewCalendar({year: 2019, month: 10, il: false});
  const shminiDiaspora = diaspora.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(leyning.getLeyningForHoliday(shminiDiaspora, false).haftara, 'I Kings 8:54 - 8:66');

  const israel = hebcal.hebrewCalendar({year: 2019, month: 10, il: true});
  const shminiIsrael = israel.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(leyning.getLeyningForHoliday(shminiIsrael, true).haftara, 'Joshua 1:1 - 1:18');
});

test('sukkot-shabbat-chm', (t) => {
  const diaspora = hebcal.hebrewCalendar({year: 2019, month: 10, il: false});
  const sukkotShabbatD = diaspora.find((e) => e.getDesc() == 'Sukkot VI (CH\'\'M)');
  const a1 = leyning.getLeyningForHoliday(sukkotShabbatD);
  t.is(a1.haftara, 'Ezekiel 38:18 - 39:16');
  t.is(formatAliyah(a1, 'M'), 'Numbers 29:26 - 29:31');

  const israel = hebcal.hebrewCalendar({year: 2017, month: 10, il: true});
  const sukkotShabbatIL = israel.find((e) => e.getDesc() == 'Sukkot III (CH\'\'M)');
  const a2 = leyning.getLeyningForHoliday(sukkotShabbatIL);
  t.is(a2.haftara, 'Ezekiel 38:18 - 39:16');
  t.is(formatAliyah(a2, 'M'), 'Numbers 29:20 - 29:25');
});

test('sephardic', (t) => {
  const options = {year: 2021, isHebrewYear: false, sedrot: true, noHolidays: true};
  const events = hebcal.hebrewCalendar(options);
  const bereshit = events.find((ev) => ev.getDesc() == 'Parashat Bereshit');
  const a = leyning.getLeyningForParshaHaShavua(bereshit);
  t.is(a.haftara, 'Isaiah 42:5 - 43:10');
  t.is(a.sephardic, 'Isaiah 42:5 - 42:21');
});

test('no-leyning-on-holiday', (t) => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = hebcal.hebrewCalendar(options);
  const tuBiShvat = events.find((e) => e.getDesc() == 'Tu BiShvat');
  const a = leyning.getLeyningForHoliday(tuBiShvat);
  t.is(a, undefined);
});
