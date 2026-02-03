import z from 'zod'

export const VoterSignupSchema = z.object({
    firstName: z.string().min(3, "First name must be at least 3 characters").max(20, "First name must not exceed 20 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters").max(20, "Last name must not exceed 20 characters"),
    dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date of birth must be in the format DD/MM/YYYY"),
    address: z.string().min(1, "Address is required"),
    gender: z.enum(['Male', 'Female', 'Other'], {message : "Invalid gender"}),
    idType: z.enum(["Aadhar Card","Voter Id"], {message : "Invalid ID type"}),
    documentNumber: z.string().min(1, "Document number is required"),
    selfieurl: z.string().url("Invalid selfie URL"),
    documenturl: z.string().url("Invalid document URL"),
    mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must not exceed 20 characters"),
    password: z.string().min(8, "Password must be at least 8 characters").max(20, "Password must not exceed 20 characters"),
    email: z.string().email("Invalid email format")
});

export const VoterSignInSchema = z.object({
    username : z.string().min(3, "Username must be at least 3 characters").max(20, "Username must not exceed 20 characters"),
    password: z.string().min(8, "Password must be at least 8 characters").max(20, "Password must not exceed 20 characters")
})

export const PartySignupSchema = z.object({
    partyName: z.string().min(3,"Party name must be at least 3 characters").max(30,"Party name must not exceed 30 characters"),
    partyAbbreviation: z.string().min(3,"Party Abbreviation must be atleast of 3 characters").max(7,"Party Abbreviation must not exceed 7 characters"),
    dateOfBirth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date of birth must be in the format DD/MM/YYYY"),
    address: z.string().min(1, "Address is required"),
    gender: z.enum(['Male', 'Female', 'Other'], {message : "Invalid gender"}),
    idType: z.enum(["Aadhar Card","Voter Id"], {message : "Invalid ID type"}),
    documentNumber: z.string().min(1, "Document number is required"),
    symbolUrl: z.string().url("Invalid symbol URL"),
    documentUrl: z.string().url("Invalid document URL"),
    mobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must not exceed 20 characters"),
    password: z.string().min(8, "Password must be at least 8 characters").max(20, "Password must not exceed 20 characters"),
    email: z.string().email("Invalid email format"),
    partyLeaderName : z.string().min(3,"Party leader name must be at least 3 characters").max(30,"Party leader name must not exceed 30 characters"),
    manifesto : z.string().url("Invalid manifesto URL"),
    partyConstitution : z.string().url("Invalid party Constitution URL")
})

export const PartySigninSchema = z.object({
    username : z.string().min(3,"Party name must be at least 3 characters").max(30,"Party name must not exceed 30 characters"),
    password: z.string().min(8, "Password must be at least 8 characters").max(20, "Password must not exceed 20 characters")
})

export const PartyTeamSchema = z.object({
    name : z.string().min(3,"Name must be at least 3 characters"),
    role : z.string().min(3, "role must be at least 3 characters"),
    avatar : z.string().url("Invalid avatar URL"),
    voterId : z.string().min(1, "Voter ID is required")
})