import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'
import {linkableSingletons} from '../singletons'
import {linkableDocuments} from '../documents'

const linkableTypes = [...linkableDocuments, ...linkableSingletons].map((s) => ({
  type: s.name as string,
}))

/**
 * Link schema object. This link object lets the user first select the type of link and then
 * then enter the URL, page reference, or post reference - depending on the type selected.
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'href',
      options: {
        list: [
          {title: 'URL', value: 'href'},
          {title: 'Page', value: 'page'},
          {title: 'Post', value: 'post'},
          {title: 'Product Category', value: 'productCategory'},
          {title: 'Product', value: 'product'},
          {title: 'Email', value: 'email'},
          {title: 'Phone', value: 'phone'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'href',
      title: 'URL',
      // string (not url) so we can skip validation when Link Type is Email/Phone
      // and accept tel:/mailto: without Sanity's default http(s)-only schemes.
      type: 'string',
      hidden: ({parent}) => parent?.linkType !== 'href',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.linkType !== 'href') {
            return true
          }
          if (!value) {
            return 'URL is required when Link Type is URL'
          }
          const trimmed = value.trim()
          if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
            return true
          }
          if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
            return true
          }
          return 'Use a URL (https://…), or switch Link Type to Email / Phone'
        }),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: linkableTypes,
      hidden: ({parent}) => parent?.linkType !== 'page',
      validation: (Rule) =>
        // Custom validation to ensure page reference is provided if the link type is 'page'
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.linkType === 'page' && !value) {
            return 'Page reference is required when Link Type is Page'
          }
          return true
        }),
    }),
    defineField({
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [{type: 'post'}],
      hidden: ({parent}) => parent?.linkType !== 'post',
      validation: (Rule) =>
        // Custom validation to ensure post reference is provided if the link type is 'post'
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string} | undefined
          if (parent?.linkType === 'post' && !value) {
            return 'Post reference is required when Link Type is Post'
          }
          return true
        }),
    }),
    defineField({
      name: 'productCategory',
      title: 'Product Category',
      type: 'reference',
      to: [{type: 'productCategory'}],
      hidden: ({parent}) => parent?.linkType !== 'productCategory',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.linkType === 'productCategory' && !value) {
            return 'Product category reference is required when Link Type is Product Category'
          }
          return true
        }),
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      hidden: ({parent}) => parent?.linkType !== 'product',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.linkType === 'product' && !value) {
            return 'Product reference is required when Link Type is Product'
          }
          return true
        }),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      hidden: ({parent}) => parent?.linkType !== 'email',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.linkType !== 'email') {
            return true
          }
          if (!value) {
            return 'Email address is required'
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address'
          }
          return true
        }),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Include country code, e.g. +971 4 572 7540',
      hidden: ({parent}) => parent?.linkType !== 'phone',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.linkType !== 'phone') {
            return true
          }
          if (!value) {
            return 'Phone number is required'
          }
          const digits = value.replace(/\D/g, '')
          if (digits.length < 7) {
            return 'Enter a valid phone number'
          }
          return true
        }),
    }),
  ],
})
