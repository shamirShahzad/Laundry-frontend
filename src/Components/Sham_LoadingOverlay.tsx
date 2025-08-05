interface NewLoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
}

const Sham_LoadingOverlay: React.FC<NewLoadingOverlayProps> = ({
  loading,
  children,
}) => {
  return (
    <>
      {loading ? (
        <div className="inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40 w-full h-full">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default Sham_LoadingOverlay;
