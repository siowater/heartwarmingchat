import { Metadata } from 'next';
import ContactForm from '@/components/contact/contact-form';

export const metadata: Metadata = {
  title: 'お問い合わせ - 優しさの交換サイト',
  description: 'お問い合わせ・ご意見・ご要望をお受けしています',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-warm-800">お問い合わせ</h1>
        <p className="mt-2 text-warm-600">ご意見・ご要望・不具合報告など、お気軽にお問い合わせください</p>
      </div>
      <ContactForm />
    </div>
  );
}

