export function GetCards(cardID: string): Promise<Card[]>

export type Card =
    {
        id: string
        badges: {
            attachmentsByType: any[]
            location: boolean
            votes: number
            viewingMemberVoted: boolean
            subscribed: boolean
            fogbugz: string
            checkItems: number
            checkItemsChecked: number
            checkItemsEarliestDue: null
            comments: number
            attachments: number
            description: boolean
            due: null
            dueComplete: boolean
            start: null
        }
        checkItemStates: null
        closed: boolean
        dueComplete: boolean
        dateLastActivity: string
        desc: string
        descData: { emoji: {} }
        due: null
        dueReminder: null
        email: null
        idBoard: string
        idChecklists: any[]
        idList: string
        idMembers: any[]
        idMembersVoted: any[]
        idShort: number
        idAttachmentCover: null
        labels: any[]
        idLabels: any[]
        manualCoverAttachment: boolean
        name: string
        pos: number
        shortLink: string
        shortUrl: string
        start: null
        subscribed: boolean
        url: string
        cover: {
            idAttachment: null
            color: null
            idUploadedBackground: null
            size: 'normal' | string
            brightness: 'dark' | string
            idPlugin: null
        },
        isTemplate: boolean
        cardRole: null
    }
