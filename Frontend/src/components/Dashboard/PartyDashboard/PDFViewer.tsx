
import { motion } from 'framer-motion';
interface PDFViewerProps {
  url: string;
  title: string;
}

export default function PDFViewer ({ url, title }: PDFViewerProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto my-8"
    >
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="relative">
        <iframe src={url} className='w-full h-[50vh] border-none'  ></iframe>
      </div>
    </motion.div>
  );
}