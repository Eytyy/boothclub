import {home} from './home'
import {blog} from './blog'
import {projects} from './projects'
import {about} from './about'
import {settings} from './settings'
import {contact} from './contact'
import {privacyPolicy} from './privacyPolicy'
export const linkableSingletons = [home, blog, projects, about, contact, privacyPolicy]
export const singletons = [settings, ...linkableSingletons]
