import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Copyright } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Gradient separator bar - matches the header */}
      <div className="h-[3px] bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9]"></div>
      
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/e173faec-c516-4d69-bca8-8be4cb8183c0.png" 
                alt="NOKTA TICKETS" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 mb-6">
              A plataforma mais segura para comprar e vender ingressos para 
              os melhores eventos do Brasil.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-900">Navegação</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">Início</Link></li>
              <li><Link to="/eventos" className="text-sm text-gray-600 hover:text-primary transition-colors">Todos os Eventos</Link></li>
              <li><Link to="/marketplace" className="text-sm text-gray-600 hover:text-primary transition-colors">Marketplace</Link></li>
            </ul>
          </div>

          {/* Account links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-900">Conta</h3>
            <ul className="space-y-2">
              <li><Link to="/minha-conta" className="text-sm text-gray-600 hover:text-primary transition-colors">Minha Conta</Link></li>
              <li><Link to="/meus-ingressos" className="text-sm text-gray-600 hover:text-primary transition-colors">Meus Ingressos</Link></li>
              <li><Link to="/favoritos" className="text-sm text-gray-600 hover:text-primary transition-colors">Favoritos</Link></li>
              <li><Link to="/notificacoes" className="text-sm text-gray-600 hover:text-primary transition-colors">Notificações</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-900">Suporte</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Fale Conosco</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0 text-gray-500 text-sm">
            <Copyright size={16} className="mr-1" />
            <span>{currentYear} NOKTA TICKETS. Todos os direitos reservados.</span>
          </div>
          <div className="text-sm text-gray-500">
            Feito com 💜 para os amantes de eventos
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
