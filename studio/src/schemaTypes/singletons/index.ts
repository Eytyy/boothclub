import {home} from './home'
import {blog} from './blog'
import {projects} from './projects'
import {about} from './about'
import {settings} from './settings'
import {contact} from './contact'
import {careers} from './careers'
import {privacyPolicy} from './privacyPolicy'
export const linkableSingletons = [home, blog, projects, about, contact, careers, privacyPolicy]
export const singletons = [settings, ...linkableSingletons]
