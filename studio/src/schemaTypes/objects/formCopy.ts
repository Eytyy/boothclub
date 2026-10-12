import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Wording for the two site forms. Every field is optional: the site falls back to
 * its built-in copy for anything left empty, so a half-filled form never shows
 * blank labels.
 */

const text = (name: string, title: string, description?: string, fieldset?: string) =>
  defineField({name, title, description, fieldset, type: 'internationalizedArrayString'})

const longText = (name: string, title: string, description?: string, fieldset?: string) =>
  defineField({name, title, description, fieldset, type: 'internationalizedArrayText'})

const options = (name: string, title: string, fieldset: string, type = 'formOption') =>
  defineField({
    name,
    title,
    fieldset,
    type: 'array',
    of: [defineArrayMember({type})],
  })

export const contactFormCopy = defineType({
  name: 'contactFormCopy',
  title: 'Form wording',
  type: 'object',
  fieldsets: [
    {name: 'section', title: 'Section', options: {collapsible: true}},
    {name: 'fields', title: 'Field labels', options: {collapsible: true}},
  ],
  fields: [
    text('eyebrow', 'Section heading', 'e.g. "Get an Instant Quote"', 'section'),
    longText('heading', 'Headline', 'The animated line above the fields.', 'section'),
    text('fullName', 'Full name', undefined, 'fields'),
    text('email', 'Email', undefined, 'fields'),
    text('phone', 'Phone', undefined, 'fields'),
    text('message', 'Message', 'e.g. "Got a specific booth in mind for your event?"', 'fields'),
    text(
      'productPrefill',
      'Message prefill on product pages',
      'Write {product} where the product name goes, e.g. "I’m interested in the {product}."',
      'fields',
    ),
    text('submit', 'Submit button', undefined, 'fields'),
  ],
})

export const quoteFormCopy = defineType({
  name: 'quoteFormCopy',
  title: 'Quote form wording',
  type: 'object',
  fieldsets: [
    {name: 'intro', title: 'Intro', options: {collapsible: true}},
    {name: 'basics', title: 'Step 1 · Event basics', options: {collapsible: true}},
    {name: 'booths', title: 'Step 2 · Booths', options: {collapsible: true}},
    {name: 'extras', title: 'Step 3 · Extras', options: {collapsible: true}},
    {name: 'details', title: 'Step 4 · Your details', options: {collapsible: true}},
    {name: 'navigation', title: 'Progress and buttons', options: {collapsible: true}},
  ],
  fields: [
    text('eyebrow', 'Eyebrow', 'e.g. "Get a quote"', 'intro'),
    longText('heading', 'Headline', 'The animated line beside the form.', 'intro'),
    longText('description', 'Description', undefined, 'intro'),

    text('basicsStep', 'Step name', 'Shown in the progress bar.', 'basics'),
    text('eventTypeQuestion', 'Event type question', undefined, 'basics'),
    options('eventTypes', 'Event types', 'basics'),
    text('cityQuestion', 'City question', undefined, 'basics'),
    options('cities', 'Cities', 'basics'),
    text('dateLabel', 'Date label', undefined, 'basics'),
    text('guestsLabel', 'Guests label', undefined, 'basics'),
    text('guestsPlaceholder', 'Guests placeholder', undefined, 'basics'),

    text('boothsStep', 'Step name', undefined, 'booths'),
    text('boothsQuestion', 'Question', undefined, 'booths'),
    text('boothsHint', 'Hint', undefined, 'booths'),
    options('booths', 'Booths', 'booths', 'boothOption'),

    text('extrasStep', 'Step name', undefined, 'extras'),
    text('extrasQuestion', 'Question', undefined, 'extras'),
    text('extrasHint', 'Hint', undefined, 'extras'),
    options('extras', 'Extras', 'extras'),
    text('notesLabel', 'Notes label', undefined, 'extras'),
    text('notesPlaceholder', 'Notes placeholder', undefined, 'extras'),

    text('detailsStep', 'Step name', undefined, 'details'),
    text('detailsQuestion', 'Question', undefined, 'details'),
    text('detailsHint', 'Hint', undefined, 'details'),
    text('fullName', 'Full name label', undefined, 'details'),
    text('company', 'Company label', undefined, 'details'),
    text('email', 'Email label', undefined, 'details'),
    text('phone', 'Phone label', undefined, 'details'),
    text('phonePlaceholder', 'Phone placeholder', undefined, 'details'),
    text('contactMethodLabel', 'Contact method question', undefined, 'details'),
    options('contactMethods', 'Contact methods', 'details'),

    text(
      'stepCounter',
      'Step counter',
      'Use {current} and {total}, e.g. "Step {current} of {total}".',
      'navigation',
    ),
    text('selectedCount', 'Selected count', 'Use {count}, e.g. "{count} selected".', 'navigation'),
    text('noneSelected', 'Nothing selected', undefined, 'navigation'),
    text('back', 'Back button', undefined, 'navigation'),
    text('next', 'Continue button', undefined, 'navigation'),
    text('submit', 'Submit button', undefined, 'navigation'),
  ],
})
