export interface Contact
{
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    gender: string;
    email?: string |  null;
    
    phoneNumbers?:  string |  null;
    dateOfBirth?: string | null;
    category: string;
    handicap: string ;
    club: string ;
    country?: string | null;
    membershipNo?: string |null;
    notes?: string |  null;
    status:boolean;
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag
{
    id?: string;
    title?: string;
}
