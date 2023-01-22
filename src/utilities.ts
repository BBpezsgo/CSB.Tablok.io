import * as HTTP from './http'
import { compile } from './handlebars.js'

export function CreateElement(htmlString: string): Element {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    const result = div.firstElementChild
    if (!result) { throw new Error("wtf?") }
    return result
}

export async function TemplateAsync(name: string, values: object) {
    const hbs = await HTTP.GetAsync('./templates/' + name + '.hbs')
    const html = compile(hbs)(values)
    return CreateElement(html)
}

export function Template(name: string, values: object) {
    const hbs = HTTP.Get('./templates/' + name + '.hbs')
    const html = compile(hbs)(values)
    return CreateElement(html)
}

export function GetElement(id: string) {
    const element =  document.getElementById(id)
    if (!element)
    { throw new Error(`Element with id "${id}" not found`) }
    return element
}

export function GetInputElement(id: string) {
    const elements = document.getElementsByTagName('input')
    const element =  elements.namedItem(id)
    if (!element)
    { throw new Error(`Element with id "${id}" not found`) }
    return element
}

export function ClearElement(element: HTMLElement) { while (element.lastChild) { element.removeChild(element.lastChild) } }

/** @author Angelos Chalaris @link https://www.30secondsofcode.org/js/s/levenshtein-distance */
export function LevenshteinDistance(s: string, t: string) {
    if (!s.length) return t.length
    if (!t.length) return s.length
    const arr = []
    for (let i = 0; i <= t.length; i++) {
      arr[i] = [i]
      for (let j = 1; j <= s.length; j++) {
        arr[i][j] =
          i === 0
            ? j
            : Math.min(
                arr[i - 1][j] + 1,
                arr[i][j - 1] + 1,
                arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
              )
      }
    }
    return arr[t.length][s.length]
}

export function NormalizeString(v: string): string { return v.trim().toLowerCase().replace(/\s+/g, ' ') }

/** @param maxDifference Must be larger than -1 @returns True if `b` is contained in `a` by the specified maximum difference */
export function CompareString(a: string, b: string, maxDifference: number, trueIfBEmpty = false): boolean {
    if (NormalizeString(b).length === 0 && trueIfBEmpty) return true
    if (maxDifference < 0) { throw new Error('CompareString parameter error: maxDifference must be larger than -1') }
    if (NormalizeString(a).includes(NormalizeString(b))) return true
    if (LevenshteinDistance(NormalizeString(a), NormalizeString(b)) <= maxDifference) return true
    return false
}

export function AssignObjects<T extends object>(values: any[], constructor: () => T) {
    for (let i = 0; i < values.length; i++) { values[i] = Object.assign(constructor(), values[i]) }
}