export function Get(url: string): string { return Request(url, 'GET') }
export function GetAsync(url: string): Promise<string> { return RequestAsync(url, 'GET') }

export function Request(url: string, method: 'GET' | 'POST'): string {
    const req = new XMLHttpRequest()
    req.onerror = () => { throw new Error(`Request error, readyState: ${req.readyState}, status: ${req.status}`) }
    req.open(method, url, false)
    req.send()
    if (req.readyState === 4) return req.responseText
    else throw new Error(`Unknown HTTP error, readyState: ${req.readyState}, status: ${req.status}`)
}
export function RequestAsync(url: string, method: 'GET' | 'POST'): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest()
        req.onreadystatechange = () => {
            if (req.readyState === 4) resolve(req.responseText)
        }
        req.onerror = (e) => reject(e)
        req.open(method, url)
        try {
            req.send()
        } catch (error) { reject(error) }
    })
}
