import { useState } from "react";
import { sendContact } from "../lib/contact.api";

export function Contact() {
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await sendContact(form);

            alert(res.message);
            setSuccess("🎉 Thank you! Your message has been sent.");

            setForm({
                name: "",
                email: "",
                subject: "",
                message: "",
            });

        } catch (err) {
            console.error(err);
            setSuccess("❌ Failed to send message.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-16">

            {/* Heading */}

            <div className="mb-12 text-center">

                <h1 className="text-5xl font-bold text-[var(--ink)]">
                    Contact Us
                </h1>

                <p className="mt-4 text-lg text-[var(--ink-soft)]">
                    We'd love to hear from you. Whether it's feedback,
                    support, business inquiries, or partnerships,
                    we're here to help.
                </p>

            </div>

            <div className="grid gap-10 lg:grid-cols-2">

                {/* Contact Info */}

                <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-8">

                    <h2 className="mb-8 text-2xl font-bold">
                        Get In Touch
                    </h2>

                    <div className="space-y-8">

                        <div>
                            <p className="font-semibold text-orange-500">
                                📍 Address
                            </p>

                            <p className="mt-1 text-[var(--ink-soft)]">
                                Kathmandu, Nepal
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-orange-500">
                                📞 Phone
                            </p>

                            <p className="mt-1 text-[var(--ink-soft)]">
                                +977 9761285140
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-orange-500">
                                ✉️ Email
                            </p>

                            <a
                                href="mailto:hackerheaven73@gmail.com"
                                className="mt-1 block text-[var(--ink-soft)] hover:text-orange-500"
                            >
                                hackerheaven73@gmail.com
                            </a>
                        </div>

                        <div>
                            <p className="font-semibold text-orange-500">
                                🕒 Working Hours
                            </p>

                            <p className="mt-1 text-[var(--ink-soft)]">
                                Sunday – Friday
                                <br />
                                9:00 AM – 6:00 PM
                            </p>
                        </div>

                    </div>

                </div>
                {success && (
                    <div className="mb-4 rounded-xl bg-green-100 p-4 text-green-700">
                        {success}
                    </div>
                )}
                {/* Form */}

                <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-8">

                    <h2 className="mb-8 text-2xl font-bold">
                        Send a Message
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <div className="grid gap-6 md:grid-cols-2">

                            <input
                                name="name"
                                placeholder="Full Name"
                                value={form.name}
                                onChange={handleChange}
                                className="rounded-xl border border-[var(--line)] bg-transparent p-3 outline-none focus:border-orange-500"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                className="rounded-xl border border-[var(--line)] bg-transparent p-3 outline-none focus:border-orange-500"
                            />

                        </div>

                        <input
                            name="subject"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[var(--line)] bg-transparent p-3 outline-none focus:border-orange-500"
                        />

                        <textarea
                            rows={6}
                            name="message"
                            placeholder="Write your message..."
                            value={form.message}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[var(--line)] bg-transparent p-3 outline-none focus:border-orange-500"
                        />

                        <button
                            disabled={loading}
                            type="submit"
                            className="rounded-xl bg-orange-500 px-8 py-3 text-white disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>

                </div>

            </div>

        </div>
    );
}