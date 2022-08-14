import test from 'ava';
import {HDate, HebrewCalendar, Event, months, flags, ParshaEvent, parshiot} from '@hebcal/core';
import {
  getLeyningForHoliday,
  getLeyningForParsha,
  getLeyningForParshaHaShavua,
} from './leyning';
import {getLeyningKeyForEvent} from './getLeyningKeyForEvent';
import {doubled, getDoubledName, formatAliyahWithBook} from './common';


test('pesach-il', (t) => {
  const events0 = HebrewCalendar.calendar({year: 5782, isHebrewYear: true, il: true});
  const events = events0.filter((ev) => ev.basename() === 'Pesach');
  const actual = [];
  for (const ev of events) {
    const reading = getLeyningForHoliday(ev, true);
    actual.push({
      h: ev.getDesc(),
      s: reading && reading.summary,
    });
  }
  const expected = [
    {h: 'Erev Pesach', s: undefined},
    {h: 'Pesach I', s: 'Exodus 12:21-51; Numbers 28:16-25'},
    {h: 'Pesach II (CH\'\'M)', s: 'Leviticus 22:26-23:44; Numbers 28:19-25'},
    {h: 'Pesach III (CH\'\'M)', s: 'Exodus 13:1-16; Numbers 28:19-25'},
    {h: 'Pesach IV (CH\'\'M)', s: 'Exodus 22:24-23:19; Numbers 28:19-25'},
    {h: 'Pesach V (CH\'\'M)', s: 'Exodus 34:1-26; Numbers 28:19-25'},
    {h: 'Pesach VI (CH\'\'M)', s: 'Numbers 9:1-14, 28:19-25'},
    {h: 'Pesach VII', s: 'Exodus 13:17-15:26; Numbers 28:19-25'},
  ];
  t.deepEqual(actual, expected);
});

test('pesach-shabbat-chm-on-3rd-day', (t) => {
  const events0 = HebrewCalendar.calendar({year: 5784, isHebrewYear: true, il: false});
  const events = events0.filter((ev) => ev.basename() === 'Pesach');
  const actual = [];
  for (const ev of events) {
    const reading = getLeyningForHoliday(ev, true);
    actual.push({
      d: ev.getDate().greg().toISOString().substring(0, 10),
      h: ev.getDesc(),
      k: getLeyningKeyForEvent(ev, false),
      s: reading && reading.summary,
    });
  }
  const expected = [
    {d: '2024-04-22', h: 'Erev Pesach', k: undefined, s: undefined},
    {
      d: '2024-04-23',
      h: 'Pesach I',
      k: 'Pesach I',
      s: 'Exodus 12:21-51; Numbers 28:16-25',
    },
    {
      d: '2024-04-24',
      h: 'Pesach II',
      k: 'Pesach II',
      s: 'Leviticus 22:26-23:44; Numbers 28:16-25',
    },
    {
      d: '2024-04-25',
      h: 'Pesach III (CH\'\'M)',
      k: 'Pesach Chol ha-Moed Day 1',
      s: 'Exodus 13:1-16; Numbers 28:19-25',
    },
    {
      d: '2024-04-26',
      h: 'Pesach IV (CH\'\'M)',
      k: 'Pesach Chol ha-Moed Day 2',
      s: 'Exodus 22:24-23:19; Numbers 28:19-25',
    },
    {
      d: '2024-04-27',
      h: 'Pesach V (CH\'\'M)',
      k: 'Pesach Shabbat Chol ha-Moed',
      s: 'Exodus 33:12-34:26; Numbers 28:19-25',
    },
    {
      d: '2024-04-28',
      h: 'Pesach VI (CH\'\'M)',
      k: 'Pesach Chol ha-Moed Day 3',
      s: 'Numbers 9:1-14, 28:19-25',
    },
    {
      d: '2024-04-29',
      h: 'Pesach VII',
      k: 'Pesach VII',
      s: 'Exodus 13:17-15:26; Numbers 28:19-25',
    },
    {
      d: '2024-04-30',
      h: 'Pesach VIII',
      k: 'Pesach VIII',
      s: 'Deuteronomy 15:19-16:17; Numbers 28:19-25',
    },
  ];
  t.deepEqual(actual, expected);
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
  let events = HebrewCalendar.calendar(options);
  let ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
  let a = getLeyningForParshaHaShavua(ev);
  t.is(a.reason, undefined);
  t.is(a.haftara, 'I Kings 18:46-19:21');

  options.year = 1982;
  events = HebrewCalendar.calendar(options);
  ev = events.find((e) => e.getDesc() == 'Parashat Pinchas');
  a = getLeyningForParshaHaShavua(ev);
  t.is(a.haftara, 'Jeremiah 1:1-2:3');
  t.is(a.reason.haftara, 'Pinchas occurring after 17 Tammuz');
});

// eslint-disable-next-line require-jsdoc
function formatAliyah(aliyot, num) {
  return formatAliyahWithBook(aliyot.fullkriyah[num]);
}

test('getLeyningForParshaHaShavua', (t) => {
  /** @type {HebrewCalendar.Options} */
  const options = {year: 2026, isHebrewYear: false, sedrot: true, noHolidays: true};
  const events = HebrewCalendar.calendar(options);
  for (const ev of events) {
    const a = getLeyningForParshaHaShavua(ev);
    switch (ev.getDesc()) {
      case 'Parashat Mishpatim':
        t.is(a.reason.haftara, 'Shabbat Shekalim');
        t.is(a.reason.M, 'Shabbat Shekalim');
        t.is(a.haftara, 'II Kings 12:1-17');
        t.is(formatAliyah(a, 'M'), 'Exodus 30:11-30:16');
        break;
      case 'Parashat Tetzaveh':
        t.is(a.reason.haftara, 'Shabbat Zachor');
        t.is(a.reason.M, 'Shabbat Zachor');
        t.is(a.haftara, 'I Samuel 15:2-34');
        t.is(formatAliyah(a, 'M'), 'Deuteronomy 25:17-25:19');
        break;
      case 'Parashat Ki Tisa':
        t.is(a.reason.haftara, 'Shabbat Parah');
        t.is(a.reason.M, 'Shabbat Parah');
        t.is(a.haftara, 'Ezekiel 36:16-38');
        t.is(formatAliyah(a, 'M'), 'Numbers 19:1-19:22');
        break;
      case 'Parashat Tzav':
        t.is(a.reason.haftara, 'Shabbat HaGadol');
        t.is(a.haftara, 'Malachi 3:4-24');
        break;
      case 'Parashat Tazria-Metzora':
        t.is(a.reason.haftara, 'Shabbat Rosh Chodesh');
        t.is(a.reason.M, 'Shabbat Rosh Chodesh');
        t.is(a.haftara, 'Isaiah 66:1-24');
        t.is(formatAliyah(a, 'M'), 'Numbers 28:9-28:15');
        break;
      case 'Parashat Bamidbar':
        t.is(a.reason.haftara, 'Shabbat Machar Chodesh');
        t.is(a.haftara, 'I Samuel 20:18-42');
        break;
      case 'Parashat Vayeshev':
        t.is(a.reason.haftara, 'Shabbat Chanukah');
        t.is(a.reason.M, 'Chanukah Day 1');
        t.is(a.haftara, 'Zechariah 2:14-4:7');
        t.is(formatAliyah(a, 'M'), 'Numbers 7:1-7:17');
        break;
      case 'Parashat Miketz':
        const expected = {
          name: {
            en: 'Miketz',
            he: 'מִקֵּץ',
          },
          parsha: [
            'Miketz',
          ],
          parshaNum: 10,
          summary: 'Genesis 41:1-44:17; Numbers 7:54-8:4',
          summaryParts: [
            {k: 'Genesis', b: '41:1', e: '44:17'},
            {k: 'Numbers', b: '7:54', e: '8:4'},
          ],
          fullkriyah: {
            '1': {k: 'Genesis', b: '41:1', e: '41:14', v: 14},
            '2': {k: 'Genesis', b: '41:15', e: '41:38', v: 24},
            '3': {k: 'Genesis', b: '41:39', e: '41:52', v: 14},
            '4': {k: 'Genesis', b: '41:53', e: '42:18', v: 23},
            '5': {k: 'Genesis', b: '42:19', e: '43:15', v: 35},
            '6': {k: 'Genesis', b: '43:16', e: '43:29', v: 14},
            '7': {k: 'Genesis', b: '43:30', e: '44:17', v: 22},
            'M': {p: 35, k: 'Numbers', b: '7:54', e: '8:4', v: 40,
              reason: 'Chanukah Day 8'},
          },
          haft: {
            k: 'I Kings',
            b: '7:40',
            e: '7:50',
            v: 11,
            reason: 'Shabbat Chanukah II',
          },
          haftara: 'I Kings 7:40-50',
          haftaraNumV: 11,
          weekday: {
            '1': {k: 'Genesis', b: '41:1', e: '41:4', v: 4},
            '2': {k: 'Genesis', b: '41:5', e: '41:7', v: 3},
            '3': {k: 'Genesis', b: '41:8', e: '41:14', v: 7},
          },
          reason: {
            haftara: 'Shabbat Chanukah II',
            M: 'Chanukah Day 8',
          },
        };
        t.deepEqual(a, expected, 'Shabbat Chanukah II');
        break;
    }
  }

  options.year = 2020;
  options.month = 12;
  let events2 = HebrewCalendar.calendar(options);
  const vayeshev = events2.find((e) => e.getDesc() == 'Parashat Vayeshev');
  let a = getLeyningForParshaHaShavua(vayeshev);
  t.is(a.reason.haftara, 'Shabbat Chanukah');
  t.is(a.reason['M'], 'Chanukah Day 2');
  t.is(a.haftara, 'Zechariah 2:14-4:7');
  t.is(formatAliyah(a, 'M'), 'Numbers 7:18-7:29');

  options.year = 2021;
  options.month = 12;
  events2 = HebrewCalendar.calendar(options);
  const miketz = events2.find((e) => e.getDesc() == 'Parashat Miketz');
  const expected = {
    name: {
      en: 'Miketz',
      he: 'מִקֵּץ',
    },
    parsha: [
      'Miketz',
    ],
    parshaNum: 10,
    summary: 'Genesis 41:1-44:17; Numbers 28:9-15, 7:42-47',
    fullkriyah: {
      '1': {k: 'Genesis', b: '41:1', e: '41:14', v: 14},
      '2': {k: 'Genesis', b: '41:15', e: '41:38', v: 24},
      '3': {k: 'Genesis', b: '41:39', e: '41:52', v: 14},
      '4': {k: 'Genesis', b: '41:53', e: '42:18', v: 23},
      '5': {k: 'Genesis', b: '42:19', e: '43:15', v: 35},
      '6': {k: 'Genesis', b: '43:16', e: '44:17', v: 36},
      '7': {p: 41, k: 'Numbers', b: '28:9', e: '28:15', v: 7,
        reason: 'Shabbat Rosh Chodesh Chanukah'},
      'M': {p: 35, k: 'Numbers', b: '7:42', e: '7:47', v: 6,
        reason: 'Shabbat Rosh Chodesh Chanukah'},
    },
    summaryParts: [
      {k: 'Genesis', b: '41:1', e: '44:17'},
      {k: 'Numbers', b: '28:9', e: '28:15'},
      {k: 'Numbers', b: '7:42', e: '7:47'},
    ],
    haft: {
      k: 'Zechariah',
      b: '2:14',
      e: '4:7',
      v: 21,
      reason: 'Shabbat Rosh Chodesh Chanukah',
    },
    haftara: 'Zechariah 2:14-4:7',
    haftaraNumV: 21,
    weekday: {
      '1': {k: 'Genesis', b: '41:1', e: '41:4', v: 4},
      '2': {k: 'Genesis', b: '41:5', e: '41:7', v: 3},
      '3': {k: 'Genesis', b: '41:8', e: '41:14', v: 7},
    },
    reason: {
      '7': 'Shabbat Rosh Chodesh Chanukah',
      'haftara': 'Shabbat Rosh Chodesh Chanukah',
      'M': 'Shabbat Rosh Chodesh Chanukah',
    },
  };
  a = getLeyningForParshaHaShavua(miketz);
  t.deepEqual(a, expected, 'Shabbat Rosh Chodesh Chanukah');

  options.year = 2019;
  options.month = 4;
  events2 = HebrewCalendar.calendar(options);
  const tazria = events2.find((e) => e.getDesc() == 'Parashat Tazria');
  a = getLeyningForParshaHaShavua(tazria);
  t.is(a.reason.haftara, 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.reason['7'], 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.reason['M'], 'Shabbat HaChodesh (on Rosh Chodesh)');
  t.is(a.haftara, 'Ezekiel 45:16-46:18');
  t.is(formatAliyah(a, '7'), 'Numbers 28:9-28:15');
  t.is(formatAliyah(a, 'M'), 'Exodus 12:1-12:20');
});

test('getLeyningForHoliday', (t) => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);

  const sukkot1 = events.find((e) => e.getDesc() == 'Sukkot I');
  const sukkot1a = getLeyningForHoliday(sukkot1);
  t.is(sukkot1a.fullkriyah['7'].p, 31);
  t.is(sukkot1a.summary, 'Leviticus 22:26-23:44; Numbers 29:12-16');
  const sukkot2 = events.find((e) => e.getDesc() == 'Sukkot II (CH\'\'M)');
  t.is(getLeyningForHoliday(sukkot2).fullkriyah['4'].p, 41);
  const shminiAtzeret = events.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(getLeyningForHoliday(shminiAtzeret).fullkriyah['7'].p, 47);
  const chanukah3 = events.find((e) => e.getDesc() == 'Chanukah: 3 Candles');
  t.is(getLeyningForHoliday(chanukah3).fullkriyah['3'].e, '7:29');
  const tevet17 = events.find((e) => e.getDesc() == 'Asara B\'Tevet');
  t.is(getLeyningForHoliday(tevet17).fullkriyah['3'].e, '34:10');
  const pesach5 = events.find((e) => e.getDesc() == 'Pesach V (CH\'\'M)');
  t.is(getLeyningForHoliday(pesach5).fullkriyah['4'].p, 21);
  const shavuot = events.find((e) => e.getDesc() == 'Shavuot');
  t.is(getLeyningForHoliday(shavuot).fullkriyah['4'].p, 17);
  const av9 = events.find((e) => e.getDesc() == 'Tish\'a B\'Av');
  t.is(getLeyningForHoliday(av9).haftara, 'Jeremiah 8:13-9:23');
});

test('getLeyningForHoliday-RoshChodesh', (t) => {
  const ev = new Event(new HDate(1, months.SIVAN, 5782),
      'Rosh Chodesh Sivan', flags.ROSH_CHODESH);
  const expected = {
    name: {
      en: 'Rosh Chodesh Sivan',
      he: 'רֹאשׁ חוֹדֶשׁ סִיוָן',
    },
    summary: 'Numbers 28:1-15',
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '28:1', e: '28:3', v: 3},
      '2': {p: 41, k: 'Numbers', b: '28:3', e: '28:5', v: 3},
      '3': {p: 41, k: 'Numbers', b: '28:6', e: '28:10', v: 5},
      '4': {p: 41, k: 'Numbers', b: '28:11', e: '28:15', v: 5},
    },
  };
  const actual = getLeyningForHoliday(ev);
  t.deepEqual(actual, expected);
});

test('Rosh Chodesh Tevet', (t) => {
  const expectedDay6 = {
    name: {
      en: 'Chanukah Day 6',
      he: 'חֲנוּכָּה יוֹם ו׳',
    },
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '28:1', e: '28:5', v: 5},
      '2': {p: 41, k: 'Numbers', b: '28:6', e: '28:10', v: 5},
      '3': {p: 41, k: 'Numbers', b: '28:11', e: '28:15', v: 5},
      '4': {p: 35, k: 'Numbers', b: '7:42', e: '7:47', v: 6},
    },
    summary: 'Numbers 28:1-15, 7:42-47',
    summaryParts: [
      {k: 'Numbers', b: '28:1', e: '28:15'},
      {k: 'Numbers', b: '7:42', e: '7:47'},
    ],
  };
  const rchTevet = new Event(new HDate(1, months.TEVET, 5784),
      'Rosh Chodesh Tevet', flags.ROSH_CHODESH);
  const reading2 = getLeyningForHoliday(rchTevet);
  t.deepEqual(reading2, expectedDay6);

  const rchTevet30kis = new Event(new HDate(30, months.KISLEV, 5787),
      'Rosh Chodesh Tevet', flags.ROSH_CHODESH);
  const reading3 = getLeyningForHoliday(rchTevet30kis);
  t.deepEqual(reading3, expectedDay6);

  const expectedDay7rch = {
    name: {
      en: 'Chanukah Day 7 (on Rosh Chodesh)',
      he: 'חֲנוּכָּה יוֹם ז׳ (רֹאשׁ חוֹדֶשׁ)',
    },
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '28:1', e: '28:5', v: 5},
      '2': {p: 41, k: 'Numbers', b: '28:6', e: '28:10', v: 5},
      '3': {p: 41, k: 'Numbers', b: '28:11', e: '28:15', v: 5},
      '4': {p: 35, k: 'Numbers', b: '7:48', e: '7:53', v: 6},
    },
    summary: 'Numbers 28:1-15, 7:48-53',
    summaryParts: [
      {k: 'Numbers', b: '28:1', e: '28:15'},
      {k: 'Numbers', b: '7:48', e: '7:53'},
    ],
  };
  const rchTevet1tev = new Event(new HDate(1, months.TEVET, 5787),
      'Rosh Chodesh Tevet', flags.ROSH_CHODESH);
  const reading4 = getLeyningForHoliday(rchTevet1tev);
  t.deepEqual(reading4, expectedDay7rch);
});

test('getLeyningForHoliday-9av-obvs', (t) => {
  const ev = new Event(new HDate(10, months.AV, 5782),
      'Tish\'a B\'Av (observed)', flags.MAJOR_FAST, {observed: true});
  const expected = {
    name: {
      en: 'Tish\'a B\'Av',
      he: 'תִּשְׁעָה בְּאָב',
    },
    summary: 'Deuteronomy 4:25-40',
    fullkriyah: {
      '1': {p: 45, k: 'Deuteronomy', b: '4:25', e: '4:29', v: 5},
      '2': {p: 45, k: 'Deuteronomy', b: '4:30', e: '4:35', v: 6},
      '3': {p: 45, k: 'Deuteronomy', b: '4:36', e: '4:40', v: 5},
    },
    haft: {
      b: '8:13',
      e: '9:23',
      k: 'Jeremiah',
      v: 34,
    },
    haftara: 'Jeremiah 8:13-9:23',
    haftaraNumV: 34,
  };
  const actual = getLeyningForHoliday(ev);
  t.deepEqual(actual, expected);
});

test('shmini-atzeret', (t) => {
  const diaspora = HebrewCalendar.calendar({year: 2019, month: 10, il: false});
  const shminiDiaspora = diaspora.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(getLeyningForHoliday(shminiDiaspora, false).haftara, 'I Kings 8:54-66');

  const israel = HebrewCalendar.calendar({year: 2019, month: 10, il: true});
  const shminiIsrael = israel.find((e) => e.getDesc() == 'Shmini Atzeret');
  t.is(getLeyningForHoliday(shminiIsrael, true).haftara, 'Joshua 1:1-18');
});

test('sukkot-shabbat-chm', (t) => {
  const diaspora = HebrewCalendar.calendar({year: 2019, month: 10, il: false});
  const sukkotShabbatD = diaspora.find((e) => e.getDesc() == 'Sukkot VI (CH\'\'M)');
  const a1 = getLeyningForHoliday(sukkotShabbatD);
  t.is(a1.haftara, 'Ezekiel 38:18-39:16');
  t.is(formatAliyah(a1, 'M'), 'Numbers 29:26-29:31');

  const israel = HebrewCalendar.calendar({year: 2017, month: 10, il: true});
  const sukkotShabbatIL = israel.find((e) => e.getDesc() == 'Sukkot III (CH\'\'M)');
  const a2 = getLeyningForHoliday(sukkotShabbatIL);
  t.is(a2.haftara, 'Ezekiel 38:18-39:16');
  t.is(formatAliyah(a2, 'M'), 'Numbers 29:20-29:25');
});

test('sephardic', (t) => {
  const options = {year: 2021, isHebrewYear: false, sedrot: true, noHolidays: true};
  const events = HebrewCalendar.calendar(options);
  const bereshit = events.find((ev) => ev.getDesc() == 'Parashat Bereshit');
  const a = getLeyningForParshaHaShavua(bereshit);
  t.is(a.haftara, 'Isaiah 42:5-43:10');
  t.is(a.sephardic, 'Isaiah 42:5-21');
});

test('no-leyning-on-holiday', (t) => {
  const options = {year: 5757, isHebrewYear: true, il: true};
  const events = HebrewCalendar.calendar(options);
  const tuBiShvat = events.find((e) => e.getDesc() == 'Tu BiShvat');
  const a = getLeyningForHoliday(tuBiShvat);
  t.is(a, undefined);
});

test('israel-getLeyningForParshaHaShavua', (t) => {
  const june6 = new Date(2020, 5, 6);
  const diaspora = HebrewCalendar.calendar({
    il: false, sedrot: true, noHolidays: true, start: june6, end: june6,
  });
  t.is(diaspora[0].getDesc(), 'Parashat Nasso');
  const nassoDiaspora = getLeyningForParshaHaShavua(diaspora[0], false);
  const may30 = new Date(2020, 4, 30);
  const israel = HebrewCalendar.calendar({
    il: true, sedrot: true, noHolidays: true, start: may30, end: may30,
  });
  t.is(israel[0].getDesc(), 'Parashat Nasso');
  const nassoIL = getLeyningForParshaHaShavua(israel[0], true);
  t.deepEqual(nassoDiaspora, nassoIL);
});

test('ignoreUserEvent-getLeyningForHoliday', (t) => {
  const ev = new Event(new HDate(20, months.TISHREI, 5780), 'Birthday', flags.USER_EVENT);
  const a = getLeyningForHoliday(ev);
  t.is(a, undefined);
});

test('pesach-days-567', (t) => {
  const april20 = new Date(2022, 3, 20);
  const april22 = new Date(2022, 3, 22);
  const events = HebrewCalendar.calendar({start: april20, end: april22});
  const result = events.map((ev) => getLeyningForHoliday(ev, false));
  const expected = [{
    name: {
      en: 'Pesach Chol ha-Moed Day 3',
      he: 'פֶּסַח חוֹל הַמּוֹעֵד יוֹם ג׳',
    },
    summary: 'Exodus 34:1-26; Numbers 28:19-25',
    summaryParts: [
      {k: 'Exodus', b: '34:1', e: '34:26'},
      {k: 'Numbers', b: '28:19', e: '28:25'},
    ],
    fullkriyah: {
      '1': {p: 21, k: 'Exodus', b: '34:1', e: '34:10', v: 10},
      '2': {p: 21, k: 'Exodus', b: '34:11', e: '34:17', v: 7},
      '3': {p: 21, k: 'Exodus', b: '34:18', e: '34:26', v: 9},
      '4': {p: 41, k: 'Numbers', b: '28:19', e: '28:25', v: 7},
    },
  },
  {
    name: {
      en: 'Pesach Chol ha-Moed Day 4',
      he: 'פֶּסַח חוֹל הַמּוֹעֵד יוֹם ד׳',
    },
    summary: 'Numbers 9:1-14, 28:19-25',
    summaryParts: [
      {k: 'Numbers', b: '9:1', e: '9:14'},
      {k: 'Numbers', b: '28:19', e: '28:25'},
    ],
    fullkriyah: {
      '1': {p: 36, k: 'Numbers', b: '9:1', e: '9:5', v: 5},
      '2': {p: 36, k: 'Numbers', b: '9:6', e: '9:8', v: 3},
      '3': {p: 36, k: 'Numbers', b: '9:9', e: '9:14', v: 6},
      '4': {p: 41, k: 'Numbers', b: '28:19', e: '28:25', v: 7},
    },
  },
  {
    name: {
      en: 'Pesach VII',
      he: 'פֶּסַח ז׳',
    },
    summary: 'Exodus 13:17-15:26; Numbers 28:19-25',
    summaryParts: [
      {k: 'Exodus', b: '13:17', e: '15:26'},
      {k: 'Numbers', b: '28:19', e: '28:25'},
    ],
    fullkriyah: {
      '1': {p: 16, k: 'Exodus', b: '13:17', e: '13:22', v: 6},
      '2': {p: 16, k: 'Exodus', b: '14:1', e: '14:8', v: 8},
      '3': {p: 16, k: 'Exodus', b: '14:9', e: '14:14', v: 6},
      '4': {p: 16, k: 'Exodus', b: '14:15', e: '14:25', v: 11},
      '5': {p: 16, k: 'Exodus', b: '14:26', e: '15:26', v: 32},
      'M': {p: 41, k: 'Numbers', b: '28:19', e: '28:25', v: 7},
    },
    haft: {
      b: '22:1',
      e: '22:51',
      k: 'II Samuel',
      v: 51,
    },
    haftara: 'II Samuel 22:1-51',
    haftaraNumV: 51,
  }];
  t.deepEqual(result, expected);
});

test('israel-sukkot-chm-day5', (t) => {
  const october8 = new Date(2020, 9, 8);
  const israel = HebrewCalendar.calendar({
    il: true, start: october8, end: october8,
  });
  t.is(israel[0].getDesc(), 'Sukkot VI (CH\'\'M)');
  const sukkotChmDay5 = getLeyningForHoliday(israel[0], true);
  t.deepEqual(sukkotChmDay5, {
    name: {
      en: 'Sukkot Chol ha-Moed Day 5',
      he: 'סוּכּוֹת חוֹל הַמּוֹעֵד יוֹם ה׳',
    },
    summary: 'Numbers 29:29-37, 29:29-34',
    summaryParts: [
      {k: 'Numbers', b: '29:29', e: '29:37'},
      {k: 'Numbers', b: '29:29', e: '29:34'},
    ],
    fullkriyah: {
      '1': {p: 41, k: 'Numbers', b: '29:29', e: '29:31', v: 3},
      '2': {p: 41, k: 'Numbers', b: '29:32', e: '29:34', v: 3},
      '3': {p: 41, k: 'Numbers', b: '29:35', e: '29:37', v: 3},
      '4': {p: 41, k: 'Numbers', b: '29:29', e: '29:34', v: 6},
    },
  });
});

test('longest-regular-haftarah', (t) => {
  const events = HebrewCalendar.calendar({
    year: 2023, numYears: 19, isHebrewYear: false,
    sedrot: true, noHolidays: true,
  });
  let numverses = 0;
  let parsha = '';
  for (const ev of events) {
    const reading = getLeyningForParshaHaShavua(ev);
    if (reading.haftaraNumV > numverses) {
      numverses = reading.haftaraNumV;
      parsha = ev.getDesc();
    }
  }
  t.is(numverses, 52);
  t.is(parsha, 'Parashat Beshalach');
});

test('longest-holiday-haftarah', (t) => {
  const events = HebrewCalendar.calendar({
    year: 2023,
    numYears: 19,
    isHebrewYear: false,
    sedrot: false,
  });
  let numverses = 0;
  let holiday = '';
  for (const ev of events) {
    const reading = getLeyningForHoliday(ev);
    if (reading && reading.haftaraNumV > numverses) {
      numverses = reading.haftaraNumV;
      holiday = ev.getDesc();
    }
  }
  t.is(numverses, 51);
  t.is(holiday, 'Pesach VII');
});

test('masei-rosh-chodesh', (t) => {
  const ev1 = new ParshaEvent(new HDate(1, 'Av', 5781), ['Matot', 'Masei'], false);
  const obj1 = getLeyningForParshaHaShavua(ev1);
  t.is(obj1.haftara, 'Jeremiah 2:4-28, 3:4; Isaiah 66:1, 66:23');
  t.is(obj1.reason.haftara, 'Matot-Masei on Shabbat Rosh Chodesh');

  const ev2 = new ParshaEvent(new HDate(2, 'Av', 5782), ['Matot', 'Masei'], false);
  const obj2 = getLeyningForParshaHaShavua(ev2);
  t.is(obj2.haftara, 'Jeremiah 2:4-28, 3:4');
  t.is(obj2.reason, undefined);

  const ev3 = new ParshaEvent(new HDate(1, 'Av', 5812), ['Masei'], false);
  const obj3 = getLeyningForParshaHaShavua(ev3);
  t.is(obj3.haftara, 'Jeremiah 2:4-28, 3:4; Isaiah 66:1, 66:23');
  t.is(obj3.haftaraNumV, 28);
  t.is(obj3.reason.haftara, 'Masei on Shabbat Rosh Chodesh');

  const ev4 = new ParshaEvent(new HDate(28, 'Tamuz', 5822), ['Masei'], false);
  const obj4 = getLeyningForParshaHaShavua(ev4);
  t.is(obj4.haftara, 'Jeremiah 2:4-28, 3:4');
  t.is(obj4.haftaraNumV, 26);
  t.is(obj4.reason, undefined);
});

test('getLeyningForParsha-1', (t) => {
  const reading = getLeyningForParsha('Pinchas');
  const expected = {
    name: {
      en: 'Pinchas',
      he: 'פִּינְחָס',
    },
    parsha: [
      'Pinchas',
    ],
    parshaNum: 41,
    summary: 'Numbers 25:10-30:1',
    fullkriyah: {
      '1': {k: 'Numbers', b: '25:10', e: '26:4', v: 14},
      '2': {k: 'Numbers', b: '26:5', e: '26:51', v: 47},
      '3': {k: 'Numbers', b: '26:52', e: '27:5', v: 19},
      '4': {k: 'Numbers', b: '27:6', e: '27:23', v: 18},
      '5': {k: 'Numbers', b: '28:1', e: '28:15', v: 15},
      '6': {k: 'Numbers', b: '28:16', e: '29:11', v: 27},
      '7': {k: 'Numbers', b: '29:12', e: '30:1', v: 29},
      'M': {k: 'Numbers', b: '29:35', e: '30:1', v: 6},
    },
    haft: {
      b: '18:46',
      e: '19:21',
      k: 'I Kings',
      v: 22,
    },
    haftara: 'I Kings 18:46-19:21',
    haftaraNumV: 22,
    weekday: {
      '1': {k: 'Numbers', b: '25:10', e: '25:12', v: 3},
      '2': {k: 'Numbers', b: '25:13', e: '25:15', v: 3},
      '3': {k: 'Numbers', b: '25:16', e: '26:4', v: 8},
    },
  };
  t.deepEqual(reading, expected);
});

test('getLeyningForParsha-2', (t) => {
  const reading2 = getLeyningForParsha(['Matot', 'Masei']);
  const expected2 = {
    name: {
      en: 'Matot-Masei',
      he: 'מַּטּוֹת־מַסְעֵי',
    },
    parsha: [
      'Matot',
      'Masei',
    ],
    parshaNum: 106,
    summary: 'Numbers 30:2-36:13',
    fullkriyah: {
      '1': {k: 'Numbers', b: '30:2', e: '31:12', v: 28},
      '2': {k: 'Numbers', b: '31:13', e: '31:54', v: 42},
      '3': {k: 'Numbers', b: '32:1', e: '32:19', v: 19},
      '4': {k: 'Numbers', b: '32:20', e: '33:49', v: 72},
      '5': {k: 'Numbers', b: '33:50', e: '34:15', v: 22},
      '6': {k: 'Numbers', b: '34:16', e: '35:8', v: 22},
      '7': {k: 'Numbers', b: '35:9', e: '36:13', v: 39},
      'M': {k: 'Numbers', b: '36:11', e: '36:13', v: 3},
    },
    haft: [{
      k: 'Jeremiah',
      b: '2:4',
      e: '2:28',
      v: 25,
    }, {
      k: 'Jeremiah',
      b: '3:4',
      e: '3:4',
      v: 1,
    }],
    haftara: 'Jeremiah 2:4-28, 3:4',
    haftaraNumV: 26,
    weekday: {
      '1': {k: 'Numbers', b: '30:2', e: '30:9', v: 8},
      '2': {k: 'Numbers', b: '30:10', e: '30:13', v: 4},
      '3': {k: 'Numbers', b: '30:14', e: '30:17', v: 4},
    },
  };
  t.deepEqual(reading2, expected2);

  const reading2b = getLeyningForParsha('Matot-Masei');
  t.deepEqual(reading2, reading2b);
});

test('getLeyningForParsha-3', (t) => {
  const reading3 = getLeyningForParsha(['Masei']);
  const expected3 = {
    name: {
      en: 'Masei',
      he: 'מַסְעֵי',
    },
    parsha: [
      'Masei',
    ],
    parshaNum: 43,
    summary: 'Numbers 33:1-36:13',
    fullkriyah: {
      '1': {k: 'Numbers', b: '33:1', e: '33:10', v: 10},
      '2': {k: 'Numbers', b: '33:11', e: '33:49', v: 39},
      '3': {k: 'Numbers', b: '33:50', e: '34:15', v: 22},
      '4': {k: 'Numbers', b: '34:16', e: '34:29', v: 14},
      '5': {k: 'Numbers', b: '35:1', e: '35:8', v: 8},
      '6': {k: 'Numbers', b: '35:9', e: '35:34', v: 26},
      '7': {k: 'Numbers', b: '36:1', e: '36:13', v: 13},
      'M': {k: 'Numbers', b: '36:11', e: '36:13', v: 3},
    },
    haft: [{
      k: 'Jeremiah',
      b: '2:4',
      e: '2:28',
      v: 25,
    }, {
      k: 'Jeremiah',
      b: '3:4',
      e: '3:4',
      v: 1,
    }],
    haftara: 'Jeremiah 2:4-28, 3:4',
    haftaraNumV: 26,
    seph: [{
      b: '2:4',
      e: '2:28',
      k: 'Jeremiah',
      v: 25,
    }, {
      b: '4:1',
      e: '4:2',
      k: 'Jeremiah',
      v: 2,
    }],
    sephardic: 'Jeremiah 2:4-28, 4:1-2',
    sephardicNumV: 27,
    weekday: {
      '1': {k: 'Numbers', b: '33:1', e: '33:3', v: 3},
      '2': {k: 'Numbers', b: '33:4', e: '33:6', v: 3},
      '3': {k: 'Numbers', b: '33:7', e: '33:10', v: 4},
    },
  };
  t.deepEqual(reading3, expected3);
});

test('no-aliyot-lessthan-three', (t) => {
  const toTest = [].concat(parshiot, doubled.map(getDoubledName));
  for (const parsha of toTest) {
    const reading = getLeyningForParsha(parsha);
    for (const [num, aliyah] of Object.entries(reading.fullkriyah)) {
      t.is(aliyah.v >= 3, true,
          `${parsha} fullkriyah ${num}: ${aliyah.b}-${aliyah.e} is < 3 verses`);
    }
    for (const [num, aliyah] of Object.entries(reading.weekday)) {
      t.is(aliyah.v >= 3, true,
          `${parsha} weekday ${num}: ${aliyah.b}-${aliyah.e} is < 3 verses`);
    }
  }
});

test('Sukkot Shabbat Chol ha-Moed', (t) => {
  const hd = new HDate(20, 'Tishrei', 5783);
  const events = HebrewCalendar.calendar({
    start: hd,
    end: hd,
  });
  const reading = getLeyningForHoliday(events[0]);
  const expected = {
    name: {
      en: 'Sukkot Shabbat Chol ha-Moed',
      he: 'סוּכּוֹת שַׁבָּת חוֹל הַמּוֹעֵד',
    },
    fullkriyah: {
      '1': {p: 21, k: 'Exodus', b: '33:12', e: '33:16', v: 5},
      '2': {p: 21, k: 'Exodus', b: '33:17', e: '33:19', v: 3},
      '3': {p: 21, k: 'Exodus', b: '33:20', e: '33:23', v: 4},
      '4': {p: 21, k: 'Exodus', b: '34:1', e: '34:3', v: 3},
      '5': {p: 21, k: 'Exodus', b: '34:4', e: '34:10', v: 7},
      '6': {p: 21, k: 'Exodus', b: '34:11', e: '34:17', v: 7},
      '7': {p: 21, k: 'Exodus', b: '34:18', e: '34:26', v: 9},
      'M': {p: 41, k: 'Numbers', b: '29:26', e: '29:31', v: 6},
    },
    summary: 'Exodus 33:12-34:26; Numbers 29:26-31',
    summaryParts: [
      {k: 'Exodus', b: '33:12', e: '34:26'},
      {k: 'Numbers', b: '29:26', e: '29:31'},
    ],
    haft: {k: 'Ezekiel', b: '38:18', e: '39:16', v: 22},
    haftara: 'Ezekiel 38:18-39:16',
    haftaraNumV: 22,
  };
  t.deepEqual(reading, expected);
});
