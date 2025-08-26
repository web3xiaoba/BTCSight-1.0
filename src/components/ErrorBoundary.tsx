import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0f16] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0e1116] border border-white/10 rounded-2xl p-6 text-center">
            <div className="p-3 rounded-full bg-red-500/20 w-fit mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-xl font-semibold mb-2">出现了一些问题</h2>
            <p className="text-white/60 mb-6">
              应用遇到了意外错误，请尝试刷新页面或联系技术支持。
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#3961FB] to-[#6344FF] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                重试
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 bg-white/6 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                刷新页面
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-white/40 hover:text-white/60">
                  错误详情 (开发模式)
                </summary>
                <pre className="mt-2 p-3 bg-black/20 rounded text-xs text-red-300 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}