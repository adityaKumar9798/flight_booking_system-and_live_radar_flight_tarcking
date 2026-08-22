import Header from '@/components/layout/Header';
import HeroBooking from '@/components/home/HeroBooking';
import HeroImage from '@/components/home/HeroImage';
import PromotionalSection from '@/components/home/PromotionalSection';
import BannerImage from '@/components/home/BannerImage';
import ExtraServices from '@/components/home/ExtraServices';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <HeroBooking />
      <HeroImage />
      <PromotionalSection />
      <BannerImage />
      <ExtraServices />
      <Footer />
    </main>
  );
}
