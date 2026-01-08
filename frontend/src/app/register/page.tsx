"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Navbar } from "@/components/Navbar";

interface TeamMember {
    name: string;
    contact: string;
    email: string;
}

interface FormData {
    teamName: string;
    leaderName: string;
    leaderContact: string;
    leaderEmail: string;
    members: TeamMember[];
    collegeName: string;
}

export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        teamName: "",
        leaderName: "",
        leaderContact: "",
        leaderEmail: "",
        members: [{ name: "", contact: "", email: "" }],
        collegeName: "",
    });

    // Captcha State
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
    const [userCaptcha, setUserCaptcha] = useState("");
    const [captchaError, setCaptchaError] = useState("");

    useEffect(() => {
        // Generate simple captcha
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setCaptcha({ num1: n1, num2: n2, answer: n1 + n2 });
    }, []);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleMemberChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newMembers = [...formData.members];
        // @ts-ignore
        newMembers[index][name as keyof TeamMember] = value;
        setFormData((prev) => ({ ...prev, members: newMembers }));
    };

    const addMember = () => {
        if (formData.members.length < 4) {
            setFormData((prev) => ({
                ...prev,
                members: [...prev.members, { name: "", contact: "", email: "" }],
            }));
        }
    };

    const removeMember = (index: number) => {
        if (formData.members.length > 1) {
            const newMembers = formData.members.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, members: newMembers }));
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone: string) => {
        return /^\d{10}$/.test(phone);
    };

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.teamName.trim()) newErrors.teamName = "Team Name is required";
        else if (formData.teamName.length < 3) newErrors.teamName = "Team Name must be at least 3 chars";

        if (!formData.leaderName.trim()) newErrors.leaderName = "Leader Name is required";

        if (!formData.leaderContact.trim()) newErrors.leaderContact = "Contact is required";
        else if (!validatePhone(formData.leaderContact)) newErrors.leaderContact = "Invalid Phone (10 digits required)";

        if (!formData.leaderEmail.trim()) newErrors.leaderEmail = "Email is required";
        else if (!validateEmail(formData.leaderEmail)) newErrors.leaderEmail = "Invalid Email Address";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        let isValid = true;
        // Logic: if a member row exists, it must be valid.
        // But backend allows gaps? No, the mapped data skips empty rows.
        // However, the UI forces at least "Member 1".
        // Let's assume ANY filled field in a row requires ALL fields in that row to be valid.
        // OR simply strict validation: All displayed member rows must be filled validly.

        const newMembers = [...formData.members];
        let hasErrors = false;

        // We can't easily show per-row errors with the current 'errors' state object structure (flat keys).
        // For now, we will just use alert for Step 2 errors or simple blocking.
        // IMPROVEMENT: Ideally we would map errors to `members[i].field`.
        // Given constraints, I'll stick to 'alert' for Step 2 details or generic valid check.
        // Wait, I can't set per-field error in the current `Input` component easily for array items without changing state structure.
        // I will adhere to the request "proper validations" by blocking invalid input and showing an alert.

        for (let i = 0; i < formData.members.length; i++) {
            const m = formData.members[i];
            if (!m.name.trim() || !m.contact.trim() || !m.email.trim()) {
                alert(`Please fill all details for Member ${i + 1}`);
                return false;
            }
            if (!validatePhone(m.contact)) {
                alert(`Invalid Phone Number for Member ${i + 1} (10 digits required)`);
                return false;
            }
            if (!validateEmail(m.email)) {
                alert(`Invalid Email Address for Member ${i + 1}`);
                return false;
            }
        }

        return true;
    };

    const validateStep3 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.collegeName.trim()) newErrors.collegeName = "College Name is required";

        if (parseInt(userCaptcha) !== captcha.answer) {
            setCaptchaError("Incorrect Captcha Answer");
            newErrors.captcha = "Incorrect";
        } else {
            setCaptchaError("");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && !newErrors.captcha;
    };

    const handleNext = async () => {
        if (step === 1 && validateStep1()) setStep(2);
        if (step === 2 && validateStep2()) setStep(3);
        if (step === 3 && validateStep3()) {
            setIsSubmitting(true);
            setSubmitError("");

            try {
                // Construct Payload
                const payload: any = {
                    team_name: formData.teamName,
                    leader: {
                        name: formData.leaderName,
                        phone: formData.leaderContact,
                        email: formData.leaderEmail
                    },
                    college_name: formData.collegeName,
                    // Optional based on backend logic
                    idea: "Pending", // Backend doc shows 'idea' in request body
                    gameName: "Pending" // Backend doc shows 'gameName' optional
                };

                // Map additional members
                // Backend expects member2, member3 etc.
                formData.members.forEach((member, index) => {
                    if (member.name && member.email) { // basic check
                        payload[`member${index + 2}`] = {
                            name: member.name,
                            phone: member.contact,
                            email: member.email
                        };
                    }
                });

                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://invento-backend.vercel.app';

                const res = await fetch(`${API_URL}/api/teams/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (data.success) {
                    setStep(4);
                } else {
                    setSubmitError(data.message || "Registration failed. Please try again.");
                }

            } catch (error) {
                setSubmitError("Network error. Please try again later.");
                console.error("Registration Error:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    if (step === 4) {
        return (
            <div className="min-h-screen bg-brand-yellow font-sans pt-24 pb-10 flex items-center justify-center p-4">
                <Navbar />
                <Card className="w-full max-w-lg text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-400 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-black text-black mb-4 uppercase tracking-tighter">
                        Registration Successful!
                    </h2>
                    <p className="text-black mb-8 text-lg font-medium border-2 border-black bg-white p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Your team <strong className="bg-brand-pink px-2 text-white transform -rotate-2 inline-block shadow-sm border border-black">{formData.teamName}</strong> has been registered.
                    </p>
                    <Link href="/">
                        <Button fullWidth variant="primary">Back to Home</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-yellow font-sans pt-24 pb-10 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[16px_16px]"></div>

            <Navbar />

            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between mb-2 px-1">
                    {['Team Leader', 'Members', 'College'].map((label, idx) => (
                        <div key={idx} className={`text-sm font-black uppercase tracking-widest ${step > idx ? 'text-black' : step === idx + 1 ? 'text-black underline decoration-4 decoration-brand-pink' : 'text-gray-500'}`}>
                            {label}
                        </div>
                    ))}
                </div>
                <div className="h-4 bg-white border-4 border-black rounded-full overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div
                        className="h-full bg-brand-pink border-r-4 border-black transition-all duration-500"
                        style={{ width: `${step === 1 ? 33 : step === 2 ? 66 : 100}%` }}
                    />
                </div>
            </div>

            <Card className="w-full max-w-2xl bg-white">
                <div className="mb-8 border-b-4 border-black pb-4">
                    <h2 className="text-4xl font-black text-black mb-2 uppercase tracking-tighter">Register Team</h2>
                    <p className="text-black font-bold">Step {step} of 3</p>
                </div>

                {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-right duration-300">
                        <Input
                            label="Studio / Team Name"
                            name="teamName"
                            placeholder="e.g. Pixel Pioneers"
                            value={formData.teamName}
                            onChange={handleChange}
                            error={errors.teamName}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Leader Name"
                                name="leaderName"
                                placeholder="John Doe"
                                value={formData.leaderName}
                                onChange={handleChange}
                                error={errors.leaderName}
                            />
                            <Input
                                label="Leader Contact"
                                name="leaderContact"
                                placeholder="+1 234 567 890"
                                value={formData.leaderContact}
                                onChange={handleChange}
                                error={errors.leaderContact}
                            />
                        </div>
                        <Input
                            label="Leader Email"
                            name="leaderEmail"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.leaderEmail}
                            onChange={handleChange}
                            error={errors.leaderEmail}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-black uppercase">Team Members</h3>
                            {formData.members.length < 4 && (
                                <button
                                    onClick={addMember}
                                    className="text-sm font-bold bg-brand-pink text-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    + Add Member
                                </button>
                            )}
                        </div>

                        {formData.members.map((member, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-xl border-2 border-black relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                {formData.members.length > 1 && (
                                    <button
                                        onClick={() => removeMember(index)}
                                        className="absolute top-2 right-2 text-black hover:text-red-500 font-black border-2 border-transparent hover:border-black rounded p-1 transition-all"
                                    >
                                        ✕
                                    </button>
                                )}
                                <div className="text-xs text-black uppercase tracking-widest mb-3 font-black bg-brand-yellow inline-block px-2 border-2 border-black transform -rotate-1">Member {index + 1}</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        label="Name"
                                        name="name"
                                        value={member.name}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        className="bg-white!"
                                    />
                                    <Input
                                        label="Contact"
                                        name="contact"
                                        value={member.contact}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        className="bg-white!"
                                    />
                                    <Input
                                        label="Email"
                                        name="email"
                                        value={member.email}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        className="bg-white!"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <Input
                            label="College Name"
                            name="collegeName"
                            placeholder="University of Technology"
                            value={formData.collegeName}
                            onChange={handleChange}
                            error={errors.collegeName}
                        />

                        <div className="p-6 bg-brand-pink/10 rounded-xl border-2 border-black border-dashed">
                            <label className="block text-md font-black text-black mb-3">
                                Security Check: What is {captcha.num1} + {captcha.num2}?
                            </label>
                            <Input
                                label="Answer"
                                placeholder="Enter the result"
                                value={userCaptcha}
                                onChange={(e) => setUserCaptcha(e.target.value)}
                                error={errors.captcha || captchaError}
                            />
                        </div>
                    </div>
                )}

                {submitError && (
                    <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 font-bold text-sm">
                        {submitError}
                    </div>
                )}

                <div className="mt-8 flex gap-4 pt-6 border-t-4 border-black">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="w-1/3"
                            disabled={isSubmitting}
                        >
                            Back
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        className={step === 1 ? 'w-full' : 'w-full'}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : step === 3 ? 'Complete Registration' : 'Next Step'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
