"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

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

        // Clear member error if specific key implementation
        // For simplicity, we might just re-validate on next click or clear generic member errors
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

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.teamName) newErrors.teamName = "Team Name is required";
        if (!formData.leaderName) newErrors.leaderName = "Leader Name is required";
        if (!formData.leaderContact) newErrors.leaderContact = "Contact is required";
        if (!formData.leaderEmail) newErrors.leaderEmail = "Email is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        // We'll just check if any field is empty and show a general error or specific
        // Since we don't have unique IDs for error mapping easily in the current loop without complexity
        // We will just return false and alert for now OR improve mapping.
        // Let's stick to a simple check.
        let isValid = true;
        const newErrors: { [key: string]: string } = {};

        formData.members.forEach((member, index) => {
            if (!member.name || !member.contact || !member.email) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Ideally we map errors to indices, but for now fallback to a global error or simple alert
            // to keep code simple as per "proper UI" request without over-engineering
            // causing bugs.
            // Let's actually use a top level error state for the step.
            alert("Please fill in all member details");
            // Keeping alert for dynamic list for now is safer than complex state mapping
            // unless I refactor significantly.
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.collegeName) newErrors.collegeName = "College Name is required";

        if (parseInt(userCaptcha) !== captcha.answer) {
            setCaptchaError("Incorrect Captcha Answer");
            newErrors.captcha = "Incorrect"; // Just to mark invalid
        } else {
            setCaptchaError("");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && !newErrors.captcha;
    };

    const handleNext = () => {

        if (step === 1 && validateStep1()) setStep(2);
        if (step === 2 && validateStep2()) setStep(3);
        if (step === 3 && validateStep3()) {
            // Submit Logic Here (e.g., API call)
            // For now, just go to success screen
            console.log("Submitting:", formData);
            setStep(4);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    if (step === 4) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-lg text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 mb-4">
                        Registration Successful!
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Your team <strong>{formData.teamName}</strong> has been registered for Invento Gamathon.
                    </p>
                    <Link href="/">
                        <Button fullWidth variant="primary">Back to Home</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-8">
                <div className="flex justify-between mb-2">
                    {['Team Leader', 'Members', 'College'].map((label, idx) => (
                        <div key={idx} className={`text-sm font-medium ${step > idx ? 'text-purple-400' : step === idx + 1 ? 'text-white' : 'text-gray-600'}`}>
                            {label}
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-out"
                        style={{ width: `${((step - 1) / 3) * 100}%` }} // Adjusted to not fill on step 1 completely unless we consider 3 steps + 1 completion.
                    // Let's make it reflect current progress 
                    // Step 1: 33%, Step 2: 66%, Step 3: 100%
                    // Actually simpler:
                    ></div>
                    <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                        style={{ width: `${step === 1 ? 33 : step === 2 ? 66 : 100}%` }}
                    />
                </div>
            </div>

            <Card className="w-full max-w-2xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Register Your Team</h2>
                    <p className="text-gray-400">Step {step} of 3</p>
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
                            <h3 className="text-lg font-semibold text-white">Team Members</h3>
                            {formData.members.length < 4 && (
                                <button
                                    onClick={addMember}
                                    className="text-sm text-purple-400 hover:text-purple-300 font-medium"
                                >
                                    + Add Member
                                </button>
                            )}
                        </div>

                        {formData.members.map((member, index) => (
                            <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/5 relative group">
                                {formData.members.length > 1 && (
                                    <button
                                        onClick={() => removeMember(index)}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                )}
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Member {index + 1}</div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        label="Name"
                                        name="name"
                                        value={member.name}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        className="!bg-black/20"
                                    />
                                    <Input
                                        label="Contact"
                                        name="contact"
                                        value={member.contact}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        className="!bg-black/20"
                                    />
                                    <Input
                                        label="Email"
                                        name="email"
                                        value={member.email}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        className="!bg-black/20"
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

                        <div className="p-6 bg-black/30 rounded-xl border border-white/10">
                            <label className="block text-sm font-medium text-gray-400 mb-3 ml-1">
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

                <div className="mt-8 flex gap-4 pt-4 border-t border-white/10">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="w-1/3"
                        >
                            Back
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        className={step === 1 ? 'w-full' : 'w-full'}
                    >
                        {step === 3 ? 'Complete Registration' : 'Next Step'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
