export const breakdownDialog = document.getElementById('lesson-breakdown-dialog');
export const breakdownBackdrop = document.getElementById('lesson-breakdown-backdrop');
export const breakdownClose = document.getElementById('lesson-breakdown-close');
export const breakdownSummary = document.getElementById('lesson-breakdown-summary');
export const breakdownVariant = document.getElementById('lesson-breakdown-variant');
export const breakdownPrice = document.getElementById('lesson-breakdown-price');
export const breakdownMeta = document.getElementById('lesson-breakdown-meta');
export const breakdownTotal = document.getElementById('lesson-breakdown-total');
export const breakdownTableBody = document.getElementById('lesson-breakdown-table-body');
export const breakdownChartGraphic = document.getElementById('lesson-breakdown-chart-graphic');
export const breakdownLegend = document.getElementById('lesson-breakdown-legend');

export const howToLink = document.getElementById('how-to-link');
export const readmeDialog = document.getElementById('readme-dialog');
export const readmeBody = document.getElementById('readme-body');
export const readmeClose = document.getElementById('readme-close');
export const readmeBackdrop = document.getElementById('readme-backdrop');

export const accountingDialog = document.getElementById('accounting-dialog');
export const accountingBackdrop = document.getElementById('accounting-backdrop');
export const accountingClose = document.getElementById('accounting-close');
export const accountingForm = document.getElementById('accounting-form');
export const accountingStudentsInput = document.getElementById('accounting-students');
export const accountingClassesInput = document.getElementById('accounting-classes');
export const accountingHoursInput = document.getElementById('accounting-hours');
export const accountingError = document.getElementById('accounting-error');
export const accountingCancel = document.getElementById('accounting-cancel');

export const controls = {
  targetNet: document.getElementById('target-net'),
  targetNetWeek: document.getElementById('target-net-week'),
  targetNetMonth: document.getElementById('target-net-month'),
  targetNetAverageWeek: document.getElementById('target-net-average-week'),
  targetNetAverageMonth: document.getElementById('target-net-average-month'),
  desiredIncomeToggleDisplay: document.getElementById('desired-income-toggle-display'),
  desiredIncomeToggleInterpretation: document.getElementById('desired-income-toggle-interpretation'),
  acceptableIncomeMin: document.getElementById('acceptable-income-min'),
  acceptableIncomeMax: document.getElementById('acceptable-income-max'),
  acceptableIncomeBasisMonthly: document.getElementById('acceptable-income-basis-monthly'),
  acceptableIncomeBasisAnnual: document.getElementById('acceptable-income-basis-annual'),
  taxRate: document.getElementById('tax-rate'),
  fixedCosts: document.getElementById('fixed-costs'),
  variableCostPerClass: document.getElementById('variable-cost-class'),
  variableCostPerStudent: document.getElementById('variable-cost-student'),
  variableCostPerStudentMonthly: document.getElementById('variable-cost-student-monthly'),
  vatRate: document.getElementById('vat-rate'),
  classesPerWeek: document.getElementById('classes-per-week'),
  studentsPerClass: document.getElementById('students-per-class'),
  hoursPerLesson: document.getElementById('hours-per-lesson'),
  lessonCost: document.getElementById('lesson-cost'),
  lessonPriceMin: document.getElementById('lesson-price-min'),
  lessonPriceMax: document.getElementById('lesson-price-max'),
  monthsOff: document.getElementById('months-off'),
  weeksOffCycle: document.getElementById('weeks-off-cycle'),
  daysOffWeek: document.getElementById('days-off-week'),
  buffer: document.getElementById('buffer'),
  currencySymbol: document.getElementById('currency-symbol'),
  recalcButton: document.getElementById('recalculate'),
  downloadCsv: document.getElementById('download-csv'),
  accountingExample: document.getElementById('open-accounting-example'),
  statusMessage: document.getElementById('status-message'),
  workingWeeksDisplay: document.getElementById('working-weeks-display'),
  workingDaysDisplay: document.getElementById('working-days-display'),
  rememberInputs: document.getElementById('remember-inputs'),
  resetSavedInputs: document.getElementById('reset-saved-inputs')
};

export const desiredIncomeFieldMap = {
  year: controls.targetNet,
  week: controls.targetNetWeek,
  month: controls.targetNetMonth,
  avgWeek: controls.targetNetAverageWeek,
  avgMonth: controls.targetNetAverageMonth
};

export const desiredIncomeTitle = document.getElementById('desired-income-title');
export const desiredIncomeLegend = document.getElementById('section-desired-income-legend');
export const acceptableIncomeBasisLabel = document.getElementById('acceptable-income-current-basis');
export const desiredIncomeLabelSpans = Array.from(
  document.querySelectorAll('#section-desired-income .label-text[data-net-label][data-gross-label]')
);
export const desiredIncomeInfoIcons = Array.from(
  document.querySelectorAll('#section-desired-income .info-icon[data-net-tooltip][data-gross-tooltip]')
);

export const tablesContainer = document.getElementById('tables-container');
export const assumptionsList = document.getElementById('assumptions-list');

export const themeToggleButton = document.getElementById('theme-toggle');
export const themeToggleLabel = themeToggleButton ? themeToggleButton.querySelector('.toggle-label') : null;
