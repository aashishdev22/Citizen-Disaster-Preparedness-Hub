import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePreparedness,
  createIncidentReport,
  filterAlerts,
  filterGuides,
  filterNotifications,
  filterShelters,
  validateLogin,
  validateRegistration,
} from './preparedness';
import {
  INITIAL_ALERTS,
  INITIAL_GUIDES,
  INITIAL_KIT_ITEMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SHELTERS,
} from '../data/seedData';

test('calculatePreparedness computes exact percentage, dashoffset, and missing items', () => {
  const summary = calculatePreparedness(INITIAL_KIT_ITEMS);
  assert.equal(summary.checkedCount, 9);
  assert.equal(summary.totalCount, 12);
  assert.equal(summary.percentage, 75);
  assert.equal(summary.strokeDashoffset, 53.4);
  assert.equal(summary.missingItems.length, 3);

  const allChecked = INITIAL_KIT_ITEMS.map((i) => ({ ...i, checked: true }));
  assert.equal(calculatePreparedness(allChecked).percentage, 100);
  assert.equal(calculatePreparedness(allChecked).strokeDashoffset, 0);

  assert.equal(calculatePreparedness([]).percentage, 0);
});

test('filterAlerts returns matching category items', () => {
  assert.equal(filterAlerts(INITIAL_ALERTS, 'all').length, 4);
  assert.equal(filterAlerts(INITIAL_ALERTS, 'critical').length, 1);
  assert.equal(filterAlerts(INITIAL_ALERTS, 'weather').length, 2);
  assert.equal(filterAlerts(INITIAL_ALERTS, 'quake').length, 1);
});

test('filterGuides searches title, subtitle, and keywords case-insensitively', () => {
  assert.equal(filterGuides(INITIAL_GUIDES, '').length, 12);
  assert.equal(filterGuides(INITIAL_GUIDES, 'cpr').length, 1);
  assert.equal(filterGuides(INITIAL_GUIDES, 'FLOOD').length, 1);
});

test('filterShelters filters by type and search text', () => {
  assert.equal(filterShelters(INITIAL_SHELTERS, '', 'all').length, 4);
  assert.equal(filterShelters(INITIAL_SHELTERS, '', 'shelter').length, 2);
  assert.equal(filterShelters(INITIAL_SHELTERS, 'KEM', 'all').length, 1);
  assert.equal(filterShelters(INITIAL_SHELTERS, 'KEM', 'shelter').length, 0);
});

test('filterNotifications filters by notification type', () => {
  assert.equal(filterNotifications(INITIAL_NOTIFICATIONS, 'all').length, 3);
  assert.equal(filterNotifications(INITIAL_NOTIFICATIONS, 'emergency').length, 1);
  assert.equal(filterNotifications(INITIAL_NOTIFICATIONS, 'updates').length, 2);
});

test('validateLogin and validateRegistration reject empty or mismatched inputs', () => {
  assert.equal(validateLogin('', 'secret').valid, false);
  assert.equal(validateLogin('+91 98204 51234', 'secret').valid, true);

  assert.equal(
    validateRegistration({
      name: 'Aarav',
      phone: '9820451234',
      password: 'password123',
      confirmPassword: 'different',
      acceptedTerms: true,
    }).valid,
    false
  );

  assert.equal(
    validateRegistration({
      name: 'Aarav',
      phone: '9820451234',
      password: 'password123',
      confirmPassword: 'password123',
      acceptedTerms: false,
    }).valid,
    false
  );

  assert.equal(
    validateRegistration({
      name: 'Aarav',
      phone: '9820451234',
      password: 'password123',
      confirmPassword: 'password123',
      acceptedTerms: true,
    }).valid,
    true
  );
});

test('createIncidentReport generates sequential civic report codes', () => {
  const report = createIncidentReport(
    {
      type: 'Fallen Tree / Road Blockage',
      severity: 'Critical',
      location: 'Shivaji Park, Dadar',
      description: 'Blocking 2 lanes',
      hasPhoto: true,
      hasVideo: false,
    },
    1
  );
  assert.equal(report.code, '#INC-MH-4092');
  assert.equal(report.severity, 'Critical');
  assert.match(report.submittedAt, /Photo attached/);
});
